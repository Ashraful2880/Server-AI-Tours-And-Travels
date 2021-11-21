const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors');

app.use(cors());
app.use(express.json());


//<------------- Database Code Here ---------->

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxp8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    async function run() {
      try {
        await client.connect();

        //<------------Database Collection ------------->
 
        const database = client.db("allDestinations");
        const allCollections = database.collection("allCollections");
        const OfferCollections = database.collection("Offers");

        //<------------ Get All Data In Offer Page ------------->

        app.get('/offers',async(req,res)=>{
          const getData=await allCollections.find({}).toArray();
          res.send(getData)
        });

          //<------------ Post New Data By User ------------->
        app.post('/addorder',async(req,res)=>{
          const receiveOrder=req.body;
          const result=await allCollections.insertOne(receiveOrder);
          res.json(result); 
          
        })

        //---------> Load Single Data In Place Order Page---------->

        app.get('/booking/:id',async(req,res)=>{
          const id=req.params.id;
          const query={_id:ObjectId(id)};
          const findData=await allCollections.findOne(query);
          res.json(findData);          
        })

        //<-------------- Post Data From Confirm Order Page -------------->

        app.post('/manageOrders', async(req,res)=>{
          const newBooking=req.body;
          const result=await OfferCollections.insertOne(newBooking);
          res.json(result);
        });
        //<----------- Get Data to My Orders Page ------------>

        app.get('/myOrders/:email',async(req,res)=>{
          const userEmail=req.params.email;
          const cursor= OfferCollections.find({email:userEmail});
          const myOrder=await cursor.toArray();
          res.json(myOrder);
        }); 

        // Get All Orders In Manage Order Page

        app.get('/manageOrders',async(req,res)=>{
          const getOrders=await OfferCollections.find({}).toArray();
          res.json(getOrders)
        });

        //<------------ Delete Order From Manage Order ------------>

        app.delete('/deleteService/:id',async(req,res)=>{
          const id=req.params.id;
          const query={_id:ObjectId(id)}
          const remove=await OfferCollections.deleteOne(query);
          console.log(remove);
          res.json(remove)
        }); 

      } finally {
        // await client.close();
      }
    }
    run().catch(console.dir);
    
    app.get('/',(req,res)=>{
      res.send('Running AI Tourse Travels')
    });


app.listen(port,()=>{
    console.log("Running Server Port is",port);
});