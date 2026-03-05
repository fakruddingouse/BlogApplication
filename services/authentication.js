require('dotenv').config()
const JWT = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;

function createTokenForUser(user) {
    // include fullName so templates can display the user's name
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}