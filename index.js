const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.6mzg5rv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;
//

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCollection = client.db('emaJohnDB').collection('products');

    app.get('/products', async (req, res) => {
      const page = parseInt(req.query.page);
      const perPage=parseInt(req.query.size)
      const skipValue= (page-1)*perPage;

      const result = await productCollection.find().skip(skipValue).limit(perPage).toArray();
      console.log(result);

      res.send(result);
    });
    // getting products count from here =>
    app.get('/productsCount', async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      console.log(count);
      res.send({ count });
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('john is busy shopping');
});

app.listen(port, () => {
  console.log(`ema john server is running on port: ${port}`);
});

//
// j
