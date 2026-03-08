require("dotenv").config()
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const Blog = require('./models/blog');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = process.env.PORT || 8000;

if (!process.env.MONGO_URI) {
    console.log("MONGO_URI not found");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve('./public')));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        res.render('home', {
            user: req.user,
            blogs: allBlogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
);