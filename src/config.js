const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb://localhost:27017/Login");

// Check if database is connected
connect.then(() => {
    console.log("Database connected Successfully");
})
.catch(() => {
    console.log("Database cannot be connected");
});

// Create a schema for users
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create a schema for blogs
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Collections
const UserCollection = mongoose.model("users", LoginSchema);
const BlogCollection = mongoose.model("blogs", BlogSchema);

module.exports = { UserCollection, BlogCollection };
