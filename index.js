const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 9000;
// console.log(process.env.DB_USER,process.env.DB_PASS,process.env.DB_NAME)

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mivuu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("err ace ki?",err)
  const orderCollection = client.db("pakkapati").collection("orders");
  const reviewCollection = client.db("pakkapati").collection("review");
  const bookingCollection = client.db("pakkapati").collection("booking");
  const  adminCollection = client.db("pakkapati").collection("admin");



    console.log('conneted successfully')

  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('add new ser', newService)
    orderCollection.insertOne(newService)
      .then(result => {
        console.log('inserted conunt', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/service', (req, res) => {
    orderCollection.find({})
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.get('/service/:id',(req,res)=>{
   orderCollection.find({ _id:ObjectId(req.params.id) })
     .toArray((err, documents) => {
       res.send(documents[0])
       console.log(err, documents)
 })

  })

  app.post('/addReview', (req, res) => {
    const newService = req.body;
    console.log('add new ser', newService)
    reviewCollection.insertOne(newService)
      .then(result => {
        console.log('inserted conunt', result.insertedCount)
        // res.send(result.insertedCount > 0)
      })
  })

  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.post('/addOrder', (req, res) => {    //for data create
    const NewProduct = req.body
    console.log(NewProduct);
    bookingCollection.insertOne(NewProduct)
      .then(result => {
       //  console.log(result)
       res.send(result.insertedCount > 0)
     })
  })

  app.get('/orders', (req, res) => {
    bookingCollection.find({email: req.query.email})
      .toArray((err, documents) => {
      res.send(documents)
    })
  })

  //for admin
  app.get('/allOrders', (req, res) => {
    bookingCollection.find({})
      .toArray((err, documents) => {
      res.send(documents)
    })
  })

  //make admin
app.post('/makeAdmin', (req, res) => {
  const user = req.body;
  adminCollection.insertOne(user)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
})

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admins) => {
        console.log("admin check",admins)
      res.send(admins.length > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    orderCollection.deleteOne({_id: ObjectId(req.params.id) })
    .then((result) => {
      console.log(result);
    })
  })

});


app.get('/', (req, res) => {
  res.send('pakkapati service center!')
})

app.listen(port)