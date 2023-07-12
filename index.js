require("dotenv").config();
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kzpijcj.mongodb.net/?retryWrites=true&w=majority`;

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("sheikmostafizurDB").collection("users");
    const skillsCollection = client
      .db("sheikmostafizurDB")
      .collection("skills");
    const portfoliosCollection = client
      .db("sheikmostafizurDB")
      .collection("portfolios");

    // ================= Users Routes =================
    // get users collection
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.send(users);
    });

    // post a user
    app.post("/users", async (req, res) => {
      if (!req?.body?.email) {
        return res.send("Email not found!");
      }
      // Check if the user already exists
      const isExist = await usersCollection.findOne({email: req.body.email});
      if (isExist) {
        return res.status(400).json({message: "User already exists"});
      }

      // Create a new user
      const newUser = await usersCollection.insertOne(req.body);
      res.status(200).json(newUser);
    });

    // get a user
    app.get("/user", async (req, res) => {
      const user = await usersCollection.findOne({email: req.query.email});
      if (!user) {
        return res.status(400).json({message: "user not found!"});
      }
      res.json(user);
    });

    // ================= Skills Routes =================
    // get skills
    app.get("/skills", async (req, res) => {
      const skills = await skillsCollection.find().toArray();
      res.json(skills);
    });

    // get a skill
    app.get("/skills/:id", async (req, res) => {
      const skill = await skillsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.json(skill);
    });

    // post a skill
    app.post("/skills", async (req, res) => {
      const skill = req.body;
      const result = await skillsCollection.insertOne(skill);
      res.json(result);
    });

    // update a skill
    app.put("/skills/:id", async (req, res) => {
      const skillId = req.params.id;
      const updatedSkill = req.body;
      const result = await skillsCollection.updateOne(
        {_id: new ObjectId(skillId)},
        {$set: updatedSkill}
      );
      res.json(result);
    });

    // delete a skill
    app.delete("/skills/:id", async (req, res) => {
      const result = await skillsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.json(result);
    });

    // ================= Portfolios Routes =================
    // add a portfolio data in the portfolios
    app.post("/portfolios", async (req, res) => {
      const portfolio = req.body;
      const result = await portfoliosCollection.insertOne(portfolio);
      res.json(result);
    });

    // get portfolios data
    app.get("/portfolios", async (req, res) => {
      // get data with reverse order
      const result = await portfoliosCollection.find().toArray();
      const reverseOrder = result.reverse();
      res.json(reverseOrder);
    });

    // get a portfolio
    app.get("/portfolios/:id", async (req, res) => {
      const portfolio = await portfoliosCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.json(portfolio);
    });

    // update a portfolio
    app.put("/portfolios/:id", async (req, res) => {
      const id = req.params.id;
      const updatedPortfolio = req.body;

      const result = await portfoliosCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: updatedPortfolio}
      );
      res.json(result);
    });

    // delete a portfolio
    app.delete("/portfolios/:id", async (req, res) => {
      const result = await portfoliosCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.json(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ping: 1});
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// route
app.get("/", (req, res) => {
  res.send("<h1>Server side running!</h1>");
});

app.listen(PORT, () =>
  console.log(`Server is running port at on http://localhost:${PORT}`)
);
