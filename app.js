
require("dotenv").config();

const path = require("path");
const express = require('express');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000 ;

mongoose.connect(process.env.MONGO_URL)
  .then((e) => console.log("Connected to database"));


app.set('view engine',"ejs");
app.set("views", path.resolve("./views"));



const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");


const { checkForAuthenticationCookie } = require("./middlewares/authentication");


app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));


app.get("/", async(req,res) => {
  const allBlogs = await Blog.find({}).sort({createdAt: -1}); 
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
})

app.use("/user", userRouter); 
app.use("/blog", blogRouter);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});