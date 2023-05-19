const { User } = require("../models/index");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkUser = async (req, res) => {
    const response = {
        code: 200,
        message : 'Invalid or unexisted user ID'
    };

    try {
        const user = await User.count({
            where: {
                email: req.params.id
            }
        })
        
        if(user > 0){
           return next();
        }

    } catch (error) {
        response.code = 500;
        response.message = error;
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
                        expiresIn: '2m'
                    }
                );

                const refresh = jwt.sign(
                    {user_id: user.id, email: user.email},
                    process.env.REFRESH_KEY,
                    {
                        expiresIn: '3m'
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

module.exports = {
    checkUser,
    authUser
}