const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const authHeader = req.get("Authorization");
    if(!authHeader || authHeader == undefined || authHeader == null) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    if(!token) {
        req.isAuth = false;
        return next();
    }
    const verify = jwt.verify(token,"qwerty!@#$");
    if(!verify) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = verify.userid;
    req.admin = verify.admin;
    return next();
}