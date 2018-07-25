var express=require("express");
var app= express();
var bodyParser= require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

// App configuration
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// Mongoose Model config
 var blogSchema= new mongoose.Schema({
     title: String,
    //  image:{type:String, default:"default_img.png"},  
       image:String,
       body:String,
       created:{type:Date, default: Date.now}
 });
 
 var Blog= mongoose.model("Blog",blogSchema);
 

 
 // RESTFUL ROUTES
 
 // # Home Route that redirects to the list of blogs
 app.get("/",function(req,res){
     res.redirect("/blogs");
 });
 
 // INDEX
 app.get("/blogs",function(req,res){
     Blog.find({},function(err,blogs){
         if(err)
         {
             console.log(err);
         }
         else{
              res.render("index",{blogs:blogs});
         }
     });
     
 });
 
// NEW 
app.get("/blogs/new",function(req,res){
    res.render("new");
});


// CREATE
app.post("/blogs",function(req,res){
    // create a blog
    // sanitizing the create code
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)
        {res.render("new");}
        else {
            // redirect to the new page
            res.redirect("/blogs");
        }
    });
});

// SHOW 
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    });
});

// EDIT
app.get("/blogs/:id/edit", function(req,res){
 Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.render("/blogs");
        }
        
        else {
            res.render("edit",{blog:foundBlog});
        }
    });
});
 
 // UPDATE
 app.put("/blogs/:id",function(req,res){
      //sanitizing the update code
    req.body.blog.body= req.sanitize(req.body.blog.body);
     Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
         if(err)
         {
             res.redirect("/blogs");
         }
         
         else{
             res.redirect("/blogs/"+req.params.id);
         }
     });
 });
 
 // DELETE 
  app.delete("/blogs/:id",function(req,res){
      Blog.findByIdAndRemove(req.params.id,function(err){
          if(err)
          {
              res.redirect("/blogs");
          }
          
          else{
              res.redirect("/blogs");
          }
      });
  });
 
 // STARTING THE SERVER
 
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has been Started!!");
});