const JWT = require('jsonwebtoken');

const secret = "3c8a04cc1d335becc7c2c04c0ad9c7c6";

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