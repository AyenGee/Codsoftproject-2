const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { UserCollection, BlogCollection } = require("./config");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Set view engine
app.set('view engine', 'ejs');

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
app.get("/", async (req, res) => {
    try {
        const blogs = await BlogCollection.find(); // Fetch all blogs from the database
        res.render("home", { blogs: blogs }); // Pass blogs to the home.ejs view
    } catch (error) {
        console.log(error);
        res.send("Error fetching blogs.");
    }
});




app.get("/signUp", (req, res) => {
    res.render("signUp");
});

app.get("/write", (req, res) => {
    res.render("write");
});

app.get("/login", (req, res) => {
    res.render("login");
});

// Register User
app.post("/signUp", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    // Check if the user already exists
    const existingUser = await UserCollection.findOne({ name: data.name });
    if (existingUser) {
        res.send("User already exists. Please choose a different username.");
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        // Store user data in the database
        const userdata = await UserCollection.insertMany(data);
        console.log(userdata);
        res.redirect("/login");
    }
});

// Login User
app.post("/login", async (req, res) => {
    try {
        const check = await UserCollection.findOne({ name: req.body.username });
        if (!check) {
            res.send("Username not found.");
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                res.render("home");
            } else {
                res.send("Wrong password.");
            }
        }
    } catch {
        res.send("Wrong details.");
    }
});

// Handle Blog Submission
app.post("/submit-blog", upload.single("image"), async (req, res) => {
    try {
        const newBlog = new BlogCollection({
            title: req.body.title,
            category: req.body.category,
            image: req.file.filename, // Store filename
            content: req.body.content,
            author: req.body.author
        });

        await newBlog.save();
        res.send("Blog Posted Successfully!");
    } catch (err) {
        res.send("Error posting blog: " + err);
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
