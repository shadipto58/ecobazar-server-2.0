const express = require('express');
const app = express();
const port = 5000;

//midleware
var cors = require('cors');
app.use(cors());
app.use(express.json());//req.body undifined solved

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://shadiptomojumder:Shadipto58k@cluster0.fmco2ha.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db('ecobazar');
        const productCollection = database.collection('product');
        const orderCollection = database.collection('orders');

        // user get
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            //console.log(users);
            res.send(products)
        })

        // specific product for cart page
        app.get('/product/:productName', async (req, res) => {
            console.log('specific user hit');
            const name = req.params.productName;
            //console.log(name);
            const query = { name: name }
            const product = await productCollection.findOne(query);
            res.send(product)

        })

        // order post
        app.post('/orders', async (req, res) => {
            //console.log('order api hit');
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
            console.log(result);
        })

    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})