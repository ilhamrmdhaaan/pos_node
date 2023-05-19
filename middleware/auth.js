const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;

    if(!token){
        return res.status(403).json({ code: 403, message: "A token is required for authentication" });
    }

    token = token.trim().split(' ');
    if(token[0] !== 'Bearer'){
        return res.status(403).json({code : 403, message: "Invalid authorization token"});
    }

    try {
        const decoded = jwt.verify(token[1], config.TOKEN_KEY);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({code: 401, message: error.message});
    }

    return next();
};

const verifyRefresh = (req, res) => {
    let {email, refreshToken} = req.body;
    const response = {};

    try {
        
        const decoded = jwt.verify(refreshToken, config.REFRESH_KEY);

        console.log(decoded);

        if(decoded.email !== email){
            return res.status(401).json({code: 401, message: "Invalid refresh token"});
        }

        const newToken = jwt.sign(
            {id: decoded.user_id, email: decoded.email},
            config.TOKEN_KEY,
            {
                expiresIn: '2m'
            }
        );

        const newRefresh = jwt.sign(
            {id: decoded.user_id, email: decoded.email},
            config.REFRESH_KEY,
            {
                expiresIn: '3m'
            }
        );

        response.code = 200;
        response.data = {
            id: decoded.user_id,
            email: decoded.email,
            token: newToken,
            refreshToken: newRefresh 
        }

        return res.json(response).end();
        
    } catch (error) {
        return res.status(401).json({code: 401, message: error.message+", please log in again"})
    }


}

module.exports = { verifyToken, verifyRefresh};