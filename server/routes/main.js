const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});



router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});



router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


function insertPostData () {
  Post.insertMany([
    {
      title: "Introduction to Data Structures and Algorithms",
      body: "Understand fundamental data structures and algorithms used in software development."
    },
    {
      title: "Exploring Machine Learning with Python",
      body: "Dive into the world of machine learning and explore various algorithms and libraries in Python."
    },
    {
      title: "Mastering React.js for Frontend Development",
      body: "Learn how to build modern and interactive user interfaces using React.js."
    },
    {
      title: "Deep Dive into Docker Containers",
      body: "Explore Docker containers and learn how to build, ship, and run applications in a consistent environment."
    },
    {
      title: "Understanding Microservices Architecture",
      body: "Learn how to design and implement microservices-based architectures for scalable and maintainable applications."
    },
    {
      title: "Exploring GraphQL for API Development",
      body: "Discover the benefits of GraphQL and how it revolutionizes API development compared to traditional REST APIs."
    },
    {
      title: "Mastering DevOps Practices",
      body: "Gain expertise in DevOps practices and tools for automating software development, testing, and deployment processes."
    },
    {
      title: "Cybersecurity Fundamentals",
      body: "Learn essential cybersecurity concepts and best practices to protect your applications and data from cyber threats."
    },
    {
      title: "Introduction to Cloud Computing",
      body: "Understand the basics of cloud computing and how it enables scalable and flexible infrastructure for modern applications."
    },
    {
      title: "Building Scalable Web Applications with Node.js",
      body: "Learn techniques and best practices for building highly scalable web applications using Node.js."
    },
  ]);
}

insertPostData();

router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});

module.exports = router;
