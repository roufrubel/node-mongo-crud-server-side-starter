const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// myDbuser
// Mn4l41YEWLHEaFMc

const uri = "mongodb+srv://myDbuser:Mn4l41YEWLHEaFMc@cluster0.tjqypvp.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(error) {
    try {
      const database = client.db("foodMaster").collection("users");
    //   const haiku = collection.collection("haiku");

    // GET API
    app.get('/users', async (req, res) => {
      const cursor = database.find({});
      const users = await cursor.toArray();
      res.send(users); 
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const user = await database.findOne(query);
      // console.log('load user with id ', id);
      res.send(user);
    })
    
    // POST API
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await database.insertOne(newUser);
        // console.log('got new user', req.body);
        // console.log('added user', result);
        res.json(result);
    })

    // UPDATE API
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email
        }
      };
      const result = await database.updateOne(filter, updateDoc, options)
      // console.log('updating users ', req);
      res.json(result);
    })

    // DELETE API
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await database.deleteOne(query);
      // console.log('deleting user with id ', result);
      res.json(result);
    })


    }
    finally {
      // await client.close();
    }
  }
  run().catch(console.error);


app.get('/', (req, res) => {
    res.send('Running my CRUD server')
})
app.listen(port, () => {
    console.log('running server on port ', port);
})
