const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressProxy = require('express-http-proxy');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const serviceMap = {
  users: 'http://localhost:8080',
  posts: 'http://localhost:8081',
  comments: 'http://localhost:8082',
};

app.use('/:service', (req, res, next) => {
  const serviceUrl = serviceMap[req.params.service];
  if (!serviceUrl) {
    return res.status(404).json({ error: 'Service not found' });
  }
  expressProxy(serviceUrl)(req, res, next);
});


// Start the server
app.listen(process.env.PORT, () => {
    console.log(`API Gateway started on port ${process.env.PORT}`);
});
