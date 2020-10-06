const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lowerCase = require("lodash.lowercase");

const homeStartingContent = "Hello, there. Welcome to a Daily Journal by Arthur Gusmao. Here you can read about some of my latest discoveries in the tech world.";
const aboutContent = "I'm in the process to becoming a master Web Developer. I felt in love with code since my firstd <Hello, world!/>. I love to creat web aplications by using HTML, CSS, JS, NODEJS(EXPRESS), DATABASE and others frameworks.";
const contactContent = "Contact me by email on this adress: contatoagusmao@gmail.com";

const posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render(__dirname + "/views/home.ejs", {homeStartingContent: homeStartingContent, posts: posts,});
});

app.get("/contact", (req, res) => {
  res.render(__dirname + "/views/contact.ejs", {contactContent: contactContent});
});

app.get("/about", (req, res) => {
  res.render(__dirname + "/views/about.ejs", {aboutContent: aboutContent});
});

app.get("/compose", (req, res) => {
  res.render(__dirname + "/views/compose.ejs");
});

app.get("/posts/:key", (req, res) => {
  const key = lowerCase(req.params.key);

  posts.forEach((obj)=>{
    const titles = lowerCase(obj.title);
    if (key === titles) {
      res.render(__dirname + "/views/post.ejs", {header: obj.title, body: obj.body});
    } else {
      res.render("/");
    };
  });

});

app.post("/compose", (req, res) => {
  const post = {
    title: req.body.postTitle,
    body: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
