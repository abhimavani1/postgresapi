const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(id) {
    const jwtSecret = "aeron123"
    const payload = {
        user: id
    };
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

}
module.exports = jwtGenerator;