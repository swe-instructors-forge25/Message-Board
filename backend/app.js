const express = require("express");
const app = express();
const port = 5001;
app.use(express.json());

const db = require("./firebase");
const { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } = require("firebase/firestore");

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// get all posts
app.get("/posts", async (req, res) => {
    try {
        let ret = [];
        const querySnapshot = await getDocs(collection(db, "messages"));
        querySnapshot.forEach((doc) => {
            ret.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        res.status(200).json(ret);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// edit a post
app.put("/posts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const username = req.body.username;
      const message = req.body.message;
      const timestamp = req.body.timestamp
      const timestampISO = req.body.timestampISO
    
      await updateDoc(doc(db, "messages", id), {
        username: username,
        message: message,
        timestamp: timestamp,
        timestampISO: timestampISO
      });
      res.status(200).json({ message: "success" });
  } catch (e) {
      res.status(400).json({ error: e.message });
  }
});

// add a post
app.post("/messages", async (req, res) => {
    try {
      const username = req.body.username;
      const message = req.body.message;
      const timestamp = req.body.timestamp
      const timestampISO = req.body.timestampISO
      
      // const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Add this line
        const docRef = await addDoc(collection(db, "messages"), {
          username: username,
          message: message,
          timestamp: timestamp,
          timestampISO: timestampISO
        });
        res.status(200).json({message: `Successfully created user with id ${docRef.id}`})
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// delete a post
app.delete("/posts/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      const docRef = await deleteDoc(doc(db, "messages", id));

      res.status(200).json({message: `Successfully deletes message with id ${id}`})
  } catch (e) {
      res.status(400).json({ error: e.message });
  }
});