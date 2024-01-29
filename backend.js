require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const {MongoClient, ServerApiVersion} = require('mongodb');
const bodyParser = require('body-parser');

const razorpayRoute = require('./routes/razorpay/razorpayRoute')
const Challenges = require('./models/challengesModel');
const Users = require('./models/userModel');
const Groups = require('./models/groupsModel');

const uri = process.env.MONGODB_URI

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
    origin: "*", credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type'],
}));

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1, strict: true, deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

app.use('/api', razorpayRoute);

app.get('/group', async (req, res) => {
    try {
        const groups = await Groups.find().populate('author')
        res.send(groups)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/group/:id/challenge', async (req, res) => {
    const {id} = req.params;
    try {
        const challenge = await Challenges.find({group: id});
        res.json(challenge);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/new-group', async (req, res) => {
    try {
        const newGroup = new Groups(req.body)
        await newGroup.save();
        res.json({status: 'ok'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/group/:id/new-challenge', async (req, res) => {
    const {id} = req.params;
    try {
        const newChallenge = new Challenges(req.body)
        newChallenge.group = id
        await newChallenge.save();
        const group = await Groups.findById(id)
        group.challenge.push(newChallenge._id)
        await group.save()
        res.json({status: 'ok'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/group/:id/challenge/:challengeId', async (req, res) => {
    const {challengeId} = req.params;
    const {status} = req.body;
    try {
        const challenge = await Challenges.findById(challengeId)
        challenge.status = status
        await challenge.save()
        res.json({status: 'ok'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/group/:id/challenge/:challengeId', async (req, res) => {
    const {challengeId} = req.params;
    try {
        await Challenges.findByIdAndDelete(challengeId)
        const group = await Groups.findById(req.params.id)
        group.challenge.pull(challengeId)
        await group.save()
        res.json({status: 'ok'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(80, () => {
    console.log('Listening on port 80');
});
