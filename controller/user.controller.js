const { User, Forgot_password_token } = require("../models/index");
const { Op } = require("sequelize");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = process.env.BCRYPT_SALT;
const sendEmail = require("../utils/email/send_email");

const checkUser = async (req, res) => {
    const response = {
        code: 200,
        message : 'Invalid or unexisted user ID'
    };

    try {
        const user = await User.count({
            where: {
                id: req.params.id
            }
        })
        
        if(user > 0){
           return next();
        }

    } catch (error) {
        response.code = 500;
        response.message = error.message;
    }
    
    return res.status(response.code).json(response).end();
}

const authUser = async (req, res) => {


    const response = {};

    if(!(req.body.email && req.body.password)){
        return res.status(400).json({code: 400, message: "email and password is required"}).end();
    }

    try {
        
        const user = await User.findOne({
            attributes: ['id', 'name', 'email', 'password', 'role'],
            where: {
                email: req.body.email
            }
        });

        if(user){
            
            if(await bcrypt.compare(req.body.password, user.password)){
                
                const token = jwt.sign(
                    {user_id : user.id, email: user.email},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: '30m'
                    }
                );

                const refresh = jwt.sign(
                    {user_id: user.id, email: user.email},
                    process.env.REFRESH_KEY,
                    {
                        expiresIn: '1h'
                    }
                )
                
                response.code = 200;
                response.data = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: token,
                    refreshToken: refresh
                };
                
            }else{
                response.code = 400;
                response.message = {
                    error: "Email or password id not valid"
                }
            }

        }else{

            response.code = 400;
            response.message = {
                error: "Email or password id not valid"
            }

        }

    } catch (error) {
        response.code = 500;
        response.message = error.message;
    }
    
    res.status(response.code).json(response).end();
}

const registerUser = async (req, res) => {
    const response = {}

    const {email, name, password} = req.body;

    if(!(email && name && password)){
        return res.status(400).json({ code: 400, message: "All field required" }).end();
    }
    
    const checkEmail = await User.count({where:{email: email}});
    if(checkEmail > 0){
        return res.status(200).json({ code: 212, message: "Email is already exist" }).end();
    }

    try {
        
        const hash = await bcrypt.hash(password, Number(bcryptSalt));

        const user = await User.create({
            name,
            email,
            password: hash
        });

        if(user){
            response.code = 200;
            response.message = {
                success: "New user has been registered"
            }
        }else{
            response.code = 400;
            response.message = {
                error: "Something wrong happen while storing data"
            }
        }


    } catch (error) {
        response.code = 500;
        response.message = error.message;
    }

    res.status(response.code).json(response).end();
}

const forgotPassword = async (req, res) => {
    const response = {};

    if(!req.body.email){
        return res.status(400).json({ code: 400, message: "Email is required" }).end();
    }

    try {

        const user = await User.findOne({
            attributes: ['id', 'name', 'email'],
            where: {
                email : req.body.email
            }
        });

        if(user){

            let token = await Forgot_password_token.findOne({where: { user_id: user.id }});
            if(token) await Forgot_password_token.destroy({where:{user_id: user.id}});



            let resetToken = crypto.randomBytes(32).toString("hex");
            const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

            token = await Forgot_password_token.create({
                user_id: user.id,
                token: hash
            });
           
            if(!token) throw new Error("Something wrong happen while processing your request");

            const link = `localhost:3000/reset?token=${resetToken}&id=${user.id}`;
            sendEmail(user.email, "Password Reset Request", { name: user.name, link: link, }, "./template/requestResetPassword.handlebars");

            response.code = 200;
            response.message = {
                success: 'Password reset link has been sent to your email'
            }

        }else{
            response.code = 400;
            response.message = {
                error: "Email is not valid"
            }
        }
        
    } catch (error) {
        response.code = 500;
        response.message = error.message;
    }

    res.status(response.code).json(response).end();
}

const resetPassword = async (req, res) => {

    const response = {};

    const {token, id, password } = req.body;

    if(!(token && id && password)){
        return res.status(400).json({ code: 400, message: "All field is required" }).end();
    }

    try {

        const storedToken = await Forgot_password_token.findOne({where:{user_id: id}});

        if(storedToken){
            const isValid = await bcrypt.compare(token, storedToken.token);

            if(isValid){

                const hash = await bcrypt.hash(password, Number(bcryptSalt));
            
                const user = await User.update(
                    {
                        password: hash
                    },
                    {
                        where: {
                            id: id
                        }
                    }
                )

                if(user){

                    await Forgot_password_token.destroy({where: {user_id: id}});

                    response.code = 200;
                    response.message = {
                        success: 'Password has been reset successfully'
                    }
                }else{
                    response.code = 400;
                    response.message = {
                        error: 'Something wrong happen while storing data'
                    }
                }

            }else{
                response.code = 400;
                response.message = {
                    error: 'Token is expired or invalid'
                }
            }

        }else{
            response.code = 400;
            response.message = {
                error: 'Provided payload is not valid'
            }
        }
        
    } catch (error) {
        response.code = 500;
        response.message = error.message;
    }

    res.status(response.code).json(response).end();

}

module.exports = {
    checkUser,
    authUser,
    forgotPassword,
    resetPassword,
    registerUser
}