const express= require('express');
const app= express();
const cors= require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port= process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mosiurrahmanromel180149:27zUhUPu0VOuZipw@cluster0.jscktri.mongodb.net/?retryWrites=true&w=majority";

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
      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect();
  
      const productCollections= client.db('productDB').collection('product');
      const cartCollections= client.db('productDB').collection('cart');
  
      app.get('/products', async(req,res)=>{
          const cursor =  productCollections.find()
          const result= await cursor.toArray();
          // console.log(result);
          res.send(result);
      })
      app.get('/products/:brand',async(req,res)=>{
          const brand= req.params.brand;
          // console.log(brand);
          const query= {brand: brand}
          const cursor=  productCollections.find(query);
          const result= await cursor.toArray();
          res.send(result);
      })
      app.get('/products/:brand/:id', async(req,res)=>{
          const id = req.params.id;
          // const query= {brand: brand}
          // const cursor=  productCollections.find(query);
          // const result= await cursor.toArray
          // const id= req.params.id;
          const query= {_id: new ObjectId(id)};
          const cursor= productCollections.find(query);
          const result= await cursor.toArray();
          res.send(result);
      })
      app.put('/products/:brand/:id', async(req,res)=>{
          const id= req.params.id;
          const product= req.body;
          const filter= {_id: new ObjectId(id)}
          const options={upsert: true}
          const updateProduct={
              $set:{
                  name: product.name,
                  brand: product.brand,
                  type: product.type,
                  photo: product.photo,
                  category: product.category,
                  price: product.price,
                  rating: product.rating,
              }
          }
          const result= await productCollections.updateOne(filter,updateProduct,options)
          res.send(result);
      })
      app.post('/products', async(req, res) => {
          const product= req.body;
          const result= await productCollections.insertOne(product);
          res.send(result);
      })
  
      // cart collection
      app.get('/cart', async (req, res) => {
          const cursor= cartCollections.find();
  
          const result= await cursor.toArray();
          res.send(result);
        })
      app.post('/cart',async(req, res)=>{
          const product= req.body;
          const result= await cartCollections.insertOne(product);
          res.send(result);
        })
        app.delete('/cart/:id',async(req, res)=>{
          const id= req.params.id;
          const query= {_id: new ObjectId(id)}
          const result = await cartCollections.deleteOne(query)
          res.send(result);
        })
  
  
  
  
  
      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
  }
// run().catch(console.dir);
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('brand shop server is running')
})

app.listen(port, () => {
    console.log(`brand shop is running on port: ${port}`)
})
