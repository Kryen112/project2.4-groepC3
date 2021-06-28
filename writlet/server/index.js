const express = require('express');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const cors = require('cors')
const expressJwt = require('express-jwt');
const mongo = require('mongodb');
const { allowedNodeEnvironmentFlags } = require('process');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  const db = client.db('writlet');
  let collections = ['users', 'mail'];
  for(let i = 0; i < collections.length; i++){
    db.listCollections({name: collections[i]})
      .next(function(err, collinfo) {
        if (collinfo) {
          console.log(collections[i] + " exists");
        }
        else{
          db.createCollection(collections[i]).then(() => {
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
      let collection = db.collection('users');
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
    let penpalList = [name];
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('users');
      let query = { name: name }
      collection.findOne(query).then((user) => {
        if (!user) {
          MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) throw err;
            const db = client.db("writlet");
            let user = { name: name, password: password, penpalList: penpalList };
            db.collection('users').insertOne(user).then(() => {
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

//friendlist vervangen naar een get die kijkt of de user bestaat :)
app.get('/api/users/:user', function (req, res) {
  let username = req.params.user;
  if(username) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('users');
      let query = { name: username }
      collection.findOne(query).then((user) => {
        if (!user) {
          res.status(200).json({ message: "user not found" });
        }
        else if (user.name === username) {
          res.status(200).json({ message: "user exists" });
        } else {
          res.sendStatus(401);
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

//geeft wachtwoord en username terug :)
app.get('/api/userinfo/:user', function (req, res) {
  let username = req.params.user;
  if(username) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('users');
      let query = { name: username }
      collection.findOne(query).then((user) => {
        if (!user) {
          res.status(404).json({ message: "user not found" });
        }
        else if (user.name === username) {
          res.status(200).json({ name: user.name, password: user.password});
        } else {
          res.sendStatus(401);
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

//wachtwoord en username worden geupdate :)
app.post('/api/userupdate', function (req, res) {
  if (req.body.name && req.body.oldname && req.body.password) {
    let user = (req.body.oldname).toLowerCase();
    let newUser = (req.body.name).toLowerCase();
    let password = req.body.password;
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      db.collection('users').updateOne({name: user, penpalList: user}, {$set: { name: newUser, password: password, "penpalList.$": newUser }}).then(() => {
        res.status(200).json({ message: "information updated" });
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
      db.collection('mail').insertOne(letter).then(() => {
        res.status(200).json({ message: "mail send" });
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.get('/api/mymail/:user', function (req, res) {
  let username = req.params.user;
  if (username) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('mail');
      let query = {"letter.recipient": username}
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

//deze werkt nu en stuurt de penpals van de persoon terug :)
app.get('/api/penpals/:user', function(req, res) {
  let username = req.params.user;
  if (username) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('users');
      let query = {name: username}
      collection.findOne(query).then((user) => {
        if (!user) {
          res.sendStatus(401);
        }
        else {
          res.status(200).json(user.penpalList);
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.post('/api/addpenpals', function (req, res) {
  if (req.body.user && req.body.penpal) {
    let currentUser = (req.body.user).toLowerCase();
    let userToAdd = (req.body.penpal).toLowerCase();
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      db.collection('users').updateOne({name: currentUser}, {$addToSet: { penpalList: userToAdd }}).then(() => {
        res.status(200).json({ message: "penpal added" });
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.get('/api/searchpenpals/:searchString', function (req, res) {
  let searchString = req.params.searchString;
  if (searchString) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('users');
      let query = {name: {'$regex' : searchString, '$options' : 'i'}};
      collection.find(query).toArray(function (error, data) {
        if (error) {
          console.log(error);
        } else {
          let resultArray = new Array;
          data.forEach(element => {
            resultArray.push(element.name);
          });
          res.status(200).json(resultArray);
        }
        client.close();
      });
    });
  }
});

app.get('/api/:currentUser/getpenpals', function (req, res) {
  let currentUser = req.params.currentUser;
  if (currentUser) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) throw err;
      const db = client.db("writlet");
      let collection = db.collection('users');
      let query = {name: currentUser};
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

app.delete('/api/:currentUser/removepenpal/:penpalToRemove'), function (req, res) {
  let currentUser = req.params.currentUser;
  let penpalToRemove = req.params.penpalToRemove;
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    const db = client.db("writlet");
    let collection = db.collection('users');
    let query = {"name.penpalList": currentUser};
    collection.deleteOne(query, (function (error) {
      if (error) {
        console.log(error);
      } else {
        res.status(200);
      }
      client.close();
    }));
  });
}

app.route('/api/secret')
.get(checkIfAuthenticated, function (req, res) {
res.json({ message: "Success! You can not see this without a token" });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
console.log("Express starting listening on port " + PORT);

});
