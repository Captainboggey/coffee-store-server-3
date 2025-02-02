const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
require('dotenv').config();


// coffee-master-2
// r0zHrvhTi8s8YlC0


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w6mhf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

  const database = client.db("coffee2DB");
  const coffeeCollection = database.collection("coffee");

  const userManagement = client.db("coffee2DB") .collection("users")



  app.post('/coffees',async(req,res)=>{
    const newCoffee = req.body;
    const result = await coffeeCollection.insertOne(newCoffee);
    res.send(result) 
  })
  
  app.get('/coffees',async(req,res)=>{
   
    const cursor = coffeeCollection.find();
    const result = await cursor.toArray();
    res.send(result)
  })

  app.get('/coffees/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await coffeeCollection.findOne(query)
    res.send(result)
  })

  app.put("/coffees/:id",async(req,res)=>{
    const id = req.params.id;
    const coffee = req.body;
    const filter = {_id: new ObjectId(id)}
    const updateDoc = {
        $set:{
name: coffee.name,
chef: coffee.chef,
supplier: coffee.supplier,
taste: coffee.taste,
category: coffee.category,
details: coffee.details,
photo: coffee.photo

        }
    };
    const options = {upsert:true};
    const result = await coffeeCollection.updateOne(filter,updateDoc,options)
    res.send(result)
  })

  app.delete('/coffees/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result =await coffeeCollection.deleteOne(query)
    res.send(result)
  })















    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('server is running')

})

app.listen(port,()=>{
    console.log('server is running on port: ',port)
})