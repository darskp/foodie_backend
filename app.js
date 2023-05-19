const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
mongoose.set('strictQuery', false);
const User = require('./models/users');
const Post = require('./models/posts');
require('dotenv').config()
//middlewares
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));
// cors ///between two origin - to share resources
app.use(cors()); //cors origin resource sharing

app.get('/users',async(req,res)=>{
       try {
        const users = await User.find()
        res.json(users)
       } catch (error) {
         console.log(error);
       }
  })

app.post('/signup', async (req, res) => {
    User.findOne({
        email: req.body.email
    }, (err, userdata) => {
        if (userdata) {
            res.send({
                message: 'Seems like you already have an account with this email id'
            })
        } else {
            const data = new User({
                name: req.body.name,
                phonenumber: req.body.phonenumber,
                email: req.body.email,
                password: req.body.password,
            })

            data.save(() => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "User registered successfully" })
                }
            })
        }
    })
})

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email}, (err, userdata) => {
        // console.log(userdata);
        if (userdata) {
            if (userdata.password == req.body.password) {
                res.send({ message: 'login successful' })
            } else {
                res.send({ message: 'login failed' })
            }
        } else {
            res.send({ message: 'No account seems to be matching with your email address' })
        }
    })
})

app.post('/add-post', async (req, res) => {
    const postData = new Post({
        author: req.body.author,
        title: req.body.title,
        summary: req.body.summary,
        image: req.body.image,
        location: req.body.location
    })
    try {
        await postData.save()
        res.send({ message: 'Post added successfully' })
    }
    catch(err){
    res.send({message:'failed add the post'})
    }
})

//get the food data from backend to front end
  app.get('/posts',async(req,res)=>{
       try {
        const posts = await Post.find()
        res.json(posts)
       } catch (error) {
         console.log(error);
       }
  })


  app.get('/posts/:id',async(req,res)=>{
    const {id} = req.params
       try {
          const singlePost = await Post.findById(id)
          res.send(singlePost)
       } catch (error) {
          console.log(error);
       }
  })

// const dburl = 'mongodb://localhost:27017/foodie'
const dburl=`mongodb+srv://${process.env.USERNAME.toLowerCase()}:${process.env.PASSWORD}@cluster0.cdnewxy.mongodb.net/foodies`
mongoose.connect(dburl).then(() => {
    console.log('Connection established');
})
app.listen(process.env.PORT, 'localhost', () => {
    console.log(`http://localhost:${process.env.PORT}`);
})

