const { createHmac, randomBytes } = require("node:crypto");
const { Schema, model } = require('mongoose');
const { createTokenForUser } = require('../services/authentication')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/userAvatar.jpg'
    }, 
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });


/* A Mongoose pre('save') hook is a middleware function that runs 
automatically 'before' a document is saved to the MongoDB database.
It is used to perform operations like data validation, transformation,
 or managing related data before the data is persisted.*/

 // Because arrow functions don’t bind this properly.
userSchema.pre('save', async function () {
    // `this` is the "document(fullName, email, password, profileImg, salt etc...)" about to be saved
    // this = ~= User
    if (!this.isModified('password')) {
        // nothing to do, simply return and allow the save to proceed
        return;
    }

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
        .update(this.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");
    
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== userProvidedHash) 
        throw new Error("Incorrect Password")

    const token = createTokenForUser(user);
    return token;
})

const User = model('user', userSchema);

module.exports = User;