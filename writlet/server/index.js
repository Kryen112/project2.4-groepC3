const express = require('express');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const cors = require('cors')
const expressJwt = require('express-jwt');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  const db = client.db('writlet');
  let collections = ['gebruiker', 'mail'];
  for(let i = 0; i < collections.length; i++){
    db.listCollections({name: collections[i]})
      .next(function(err, collinfo) {
        if (collinfo) {
          console.log(collections[i] + " exists");
        }
        else{
          db.createCollection(collections[i]).then((doc) => {
          }).finally(() => {
            client.close();
          });
          console.log(collections[i] + " created");
        }
      });
  }
});

const signOptions = {
  expiresIn: '1d',
  algorithm: 'ES256'
};

const privateKey = fs.readFileSync('./private.pem', 'utf8');
const publicKey = fs.readFileSync('./public.pem', 'utf8');

const checkIfAuthenticated = expressJwt({
  secret: publicKey
});

// Express
const app = express();
app.use(cors());

//parse usual forms
app.use(express.urlencoded({extended: true}));

//parse json for APIs
app.use(express.json());

app.get('/api', async (req, res) => {
  res.sendStatus(200);
});

app.post('/api/login', function (req, res) {
  if (req.body.name && req.body.password) {
    let name = (req.body.name).toLowerCase();
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('gebruiker');
      let query = { name: name }
      collection.findOne(query).then((user) => {
        if (!user) {
          res.sendStatus(401);
        }
        else if (user.password === req.body.password) {
          let payload = { name, id: user.id };
          let token = jwt.sign(payload, privateKey, signOptions);
          res.json({
            message: 'ok',
            token: token,
            expiresIn: jwt.decode(token).exp
          });
        } else {
          res.sendStatus(401);
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.post('/api/register', function (req, res) {
  if (req.body.name && req.body.password) {
    let name = (req.body.name).toLowerCase();
    let password = req.body.password;
    let penpalList = req.body.penpalList
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('gebruiker');
      let query = { name: name }
      collection.findOne(query).then((user) => {
        if (!user) {
          MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            const db = client.db("writlet");
            let user = { name: name, password: password, penpalList: penpalList };
            db.collection('gebruiker').insertOne(user).then((doc) => {
              res.status(200).json({ message: "user created" });
            }).finally(() => {
              client.close();
            });
          });
        }
        else {
          res.status(403).json({ message: "username taken" });
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.post('/api/friendlist', function (req, res) {
  if (req.body.user && req.body.friend) {
    let user = (req.body.user).toLowerCase();
    let friend = (req.body.friend).toLowerCase();
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('gebruiker');
      let query = { name: friend }
      collection.findOne(query).then((user) => {
        if (!user) {
          res.sendStatus(401);
        }
        else if (user.name === friend) {
          res.status(200).json({ message: "friend exist" });
        } else {
          res.sendStatus(401);
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.post('/api/mail', function (req, res) {
  if (req.body.letter) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let letter = { letter: req.body.letter };
      db.collection('mail').insertOne(letter).then((doc) => {
        res.status(200).json({ message: "mail send" });
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.get('/api/mymail/:user', function (req, res) {
  let user = req.params.user;
  if (user) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('mail');
      let query = {"letter.recipient": user}
      collection.find(query).toArray(function (error, data) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json(data);
        }
        client.close();
      });
    });
  }
});

app.get('api/penpals/:user', function(req, res) {
  let user = req.params.user;
  if (user) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('penpals');
      let query = {user}
      collection.find(query).toArray(function (error, data) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json(data);
        }
        client.close();
      });
    });
  }
});

app.post('/api/penpals', function (req, res) {
  if (req.body.user && req.body.penpal) {
    let currentUser = (req.body.user).toLowerCase();
    let userToAdd = (req.body.penpal).toLowerCase();
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      db.collection('gebruiker').updateOne({name: currentUser}, {$addToSet: { penpalList: userToAdd }}).then((doc) => {
        res.status(200).json({ message: "penpal added" });
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.route('/api/secret')
.get(checkIfAuthenticated, function (req, res) {
res.json({ message: "Success! You can not see this without a token" });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
console.log("Express starting listening on port " + PORT);
});
