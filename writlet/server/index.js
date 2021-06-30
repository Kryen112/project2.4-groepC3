const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const expressJwt = require('express-jwt');
const bcrypt = require('bcrypt');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  const db = client.db('writlet');
  let collections = ['users', 'mail'];
  for(let i = 0; i < collections.length; i++){
    db.listCollections({name: collections[i]})
      .next(function(err, collinfo) {
        if (!collinfo) {
          db.createCollection(collections[i]).then(() => {
          }).finally(() => {
            client.close();
          });
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

app.post('/api/login', async function (req, res) {
  if (req.body.name && req.body.password) {
    try {
      let name = (req.body.name).toLowerCase();
      await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if (err) throw err;
        const db = client.db('writlet');
        let collection = db.collection('users');
        let query = {name: name}
        collection.findOne(query).then(async (user) => {
          if (!user) {
            res.sendStatus(401);
          } else if (await bcrypt.compare(req.body.password, user.password)) {
            let payload = {name, id: user.id};
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
    catch{
      res.sendStatus(500);
    }
  }
});

app.post('/api/register', async function (req, res) {
  if (req.body.name && req.body.password) {
    let name = (req.body.name).toLowerCase();
    let penpalList = [name];
    try{
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if (err) throw err;
        const db = client.db('writlet');
        let collection = db.collection('users');
        let query = {name: name}
        collection.findOne(query).then((user) => {
          if (!user) {
            MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
              if (err) throw err;
              const db = client.db("writlet");
              let user = {name: name, password: hashedPassword, penpalList: penpalList};
              db.collection('users').insertOne(user).then(() => {
                res.status(200).json({message: 'user created'});
              }).finally(() => {
                client.close();
              });
            });
          } else {
            res.status(403).json({message: 'username taken'});
          }
        }).finally(() => {
          client.close();
        });
      });
    }
    catch{
      res.sendStatus(500);
    }
  }
});

app.get('/api/users/:user', async function (req, res) {
  let username = req.params.user;
  if(username) {
    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db('writlet');
      let collection = db.collection('users');
      let query = {name: username}
      collection.findOne(query).then((user) => {
        if (!user) {
          res.status(200).json({message: 'user not found'});
        } else if (user.name === username) {
          res.status(200).json({message: 'user exists'});
        } else {
          res.sendStatus(401);
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.get('/api/userinfo/:user', async function (req, res) {
  let username = req.params.user;
  if(username) {
    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db('writlet');
      let collection = db.collection('users');
      let query = {name: username}
      collection.findOne(query).then((user) => {
        if (!user) {
          res.status(404).json({message: 'user not found'});
        } else if (user.name === username) {
          res.status(200).json({name: user.name, password: user.password});
        } else {
          res.sendStatus(401);
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.post('/api/userupdate', async function (req, res) {
  if (req.body.name && req.body.oldname && req.body.password) {
    try {
      let user = (req.body.oldname).toLowerCase();
      let newUser = (req.body.name).toLowerCase();
      let hashedPassword = await bcrypt.hash(req.body.password, 10);
      await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if (err) throw err;
        const db = client.db('writlet');
        if(req.body.password !== '1'){
          db.collection('users').updateOne({name: user}, {
            $set: {
              name: newUser,
              password: hashedPassword
            }
          }).then(() => {
          }).finally(() => {
            client.close();
          });
        }
        else if(req.body.password === '1'){
          db.collection('users').updateOne({name: user}, {
            $set: {
              name: newUser
            }
          }).then(() => {
          }).finally(() => {
            client.close();
          });
        }
        db.collection('users').updateMany({penpalList: user}, {$set: {'penpalList.$': newUser}}).then(() => {
          res.status(200).json({message: 'information updated'});
        }).finally(() => {
          client.close();
        });
      });
    }
    catch{
      res.sendStatus(500);
    }
  }
});

app.get('/api/users/:user/hashcheck/:password', async function (req, res) {
  let username = req.params.user;
  let password = req.params.password;
  if(username && password) {
    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db('writlet');
      let collection = db.collection('users');
      let query = {name: username}
      collection.findOne(query).then(async (user) => {
        if (!user) {
          res.status(404).json({message: 'could not check hash'});
        } else if (user.name === username) {
          if(await bcrypt.compare(password, user.password)){
            res.status(200).json({message: 'hash was a match'});
          }
          else{
            res.status(200).json({message: 'hash was no match'});
          }
        } else {
          res.sendStatus(401);
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.post('/api/mail', async function (req, res) {
  if (req.body.letter) {
    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db('writlet');
      let letter = {letter: req.body.letter};
      db.collection('mail').insertOne(letter).then(() => {
        res.status(200).json({message: 'mail sent'});
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.get('/api/mymail/:user', async function (req, res) {
  let username = req.params.user;
  if (username) {
    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db('writlet');
      let collection = db.collection('mail');
      let query = {'letter.recipient': username}
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

app.get('/api/penpals/:user', async function (req, res) {
  let username = req.params.user;
  if (username) {
    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db('writlet');
      let collection = db.collection('users');
      let query = {name: username}
      collection.findOne(query).then((user) => {
        if (!user) {
          res.sendStatus(401);
        } else {
          res.status(200).json(user.penpalList);
        }
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.post('/api/addpenpals', async function (req, res) {
  if (req.body.user && req.body.penpal) {
    let currentUser = (req.body.user).toLowerCase();
    let userToAdd = (req.body.penpal).toLowerCase();
    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db('writlet');
      db.collection('users').updateOne({name: currentUser}, {$addToSet: {penpalList: userToAdd}}).then(() => {
        res.status(200).json({message: 'penpal added'});
      }).finally(() => {
        client.close();
      });
    });
  }
});

app.get('/api/searchpenpals/:searchString', async function (req, res) {
  let searchString = req.params.searchString;
  if (searchString) {
    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db('writlet');
      let collection = db.collection('users');
      let query = {name: {'$regex': searchString, '$options': 'i'}};
      collection.find(query).toArray(function (error, data) {
        if (error) {
          console.log(error);
        } else {
          let resultArray = [];
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

app.get('/api/:currentUser/getpenpals', async function (req, res) {
  let currentUser = req.params.currentUser;
  if (currentUser) {
    await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) throw err;
      const db = client.db('writlet');
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

app.put('/api/:currentUser/removepenpal/:penpalToRemove', async function (req, res) {
  let currentUser = req.params.currentUser;
  let penpalToRemove = req.params.penpalToRemove;
  await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) throw err;
    const db = client.db('writlet');
    let collection = db.collection('users');
    collection.updateOne({name: currentUser}, {'$pull': {'penpalList': penpalToRemove}}, (function (error) {
      if (error) {
        console.log(error);
      } else {
        res.status(200);
      }
      client.close();
    }));
  });
});

app.delete('/api/deleteletter/:id', async function (req, res) {
  let currentLetter = req.params.id;
  await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) throw err;
    const db = client.db('writlet');
    let collection = db.collection('mail');
    collection.deleteOne({_id: mongo.ObjectId(currentLetter)},  (function (error) {
      if (error) {
        console.log(error);
      } else {
        res.status(200);
      }
      client.close();
    }));
  })
});

app.route('/api/secret')
.get(checkIfAuthenticated, function (req, res) {
res.json({ message: 'Success! You can not see this without a token' });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
console.log('Express starting listening on port ' + PORT);
});
