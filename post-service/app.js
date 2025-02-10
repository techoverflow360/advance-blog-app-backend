const express = require('express');
const routes = require("./routes/postRoutes");
require('dotenv').config();   // for .env variables 

const bodyParser = require('body-parser');   // bodyParser in Node.js is a middleware that parses incoming request bodies and 
                                            //  makes them available under the req.body property in your application.
const cors = require('cors');                // for cross origin resource sharing, we mention client url and port 

// main app to do everything 
const app = express();
app.use(bodyParser.json());   // to parse json data
app.use(bodyParser.urlencoded({ extended: true }))  // to parse url encoded data
app.use(cors({origin: 'http://localhost:3000'}));  // to allow cross

app.use('/posts', routes);  

app.listen(process.env.PORT, () => {
    console.log("Post - Server started at Port : " + process.env.PORT);
})
