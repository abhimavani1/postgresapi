
const jwt = require("jsonwebtoken");

require("dotenv").config();


module.exports = async (req, res, next) => {
    try {
        const token = req.header("jwt_token");
        const jwtSecret = "aeron123"
        if (!token) {
            return res.status(403).json({ msg: "authorization denied" });
        }
        const verifys = jwt.verify(token, jwtSecret);

        req.user = verifys.user;

        next();
    } catch (err) {
        res.status(401).json({ msg: err });
    }
};