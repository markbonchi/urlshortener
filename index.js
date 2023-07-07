require('dotenv').config();
const bodyParser = require('body-parser');
const shortUrl = require('./module/shortenUrl');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
// import express from 'express';
const cors = require('cors');
const app = express();

dotenv.config({ path: "sample.env" })

// Basic Configuration
const port = process.env.PORT || 3000;

const myDb = process.env["MONGO_URL"];

// create database
mongoose.connect(myDb, {
  useNewUrlParser: true, useUnifiedTopology: true,
})

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// redirect test
app.get('/api/google', (req, res) => {
  res.status(301).redirect("https://www.google.com");
});

// ...
app.post('/api/shorturl', async (req, res) => {
  const findDoc = await shortUrl.find({ fullUrl: req.body.url })
  // console.log(findDoc)
  if (findDoc && findDoc.length) {
    await shortUrl.find({ fullUrl: req.body.url })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      return console.error(err);
    });
  } else {
    await shortUrl.create([{ fullUrl: req.body.url }])
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        return console.error(err);
      })
  }
});

// redirect using shorturl
app.get('/api/shorturl/:path', async (req, res) => {
  await shortUrl.find({ shortUrl: req.params.path })
    .then(([doc]) => {
      // res.json(doc);
      res.status(301).redirect(doc.fullUrl);
    })
    .catch((err) => {
      return console.error(err);
    });
});




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
