const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lowerCase = require("lodash.lowercase");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@cluster0.9eljj.gcp.mongodb.net/journalDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const homeStartingContent = "Hello, there. Welcome to a Daily Journal by Arthur Gusmao. Here you can read about some of my latest discoveries in the tech world.";
const aboutContent = "I'm in the process to becoming a master Web Developer. I felt in love with code since my firstd <Hello, world!/>. I love to creat web aplications by using HTML, CSS, JS, NODEJS(EXPRESS), DATABASE and others frameworks.";
const contactContent = "Contact me by email on this adress: contatoagusmao@gmail.com";

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//DB SCHEMA
const {
  Schema
} = mongoose;
const postSchema = new Schema({
  title: String,
  post: String
});
const Post = mongoose.model('Post', postSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
      if (!err) {
        res.render("home.ejs", {
          homeStartingContent: homeStartingContent,
          posts: posts
        });
      }
  });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", {
    contactContent: contactContent
  });
});

app.get("/about", (req, res) => {
  res.render("about.ejs", {
    aboutContent: aboutContent
  });
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.get("/posts/:key", (req, res) => {
  const key = lowerCase(req.params.key);
  Post.find({}, (err, found) => {
    found.forEach((obj) => {
      const titles = lowerCase(obj.title);
      if (key === titles) {
        res.render("post.ejs", {
          header: obj.title,
          body: obj.post
        });
      } else {
        res.redirect("/");
      }
    });
  });

});

app.post("/compose", (req, res) => {
  const newPost = new Post({
    title: req.body.postTitle,
    post: req.body.postBody
  })
  newPost.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });

});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
