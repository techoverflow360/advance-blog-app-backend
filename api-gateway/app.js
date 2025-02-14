const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 

const crossServerRequestUsingAxios = async (req, PORT) => {

  /*
    --> Why is This Important?
    Some HTTP servers close connections if Content-Length is missing or incorrect.
    If Content-Length is too large, the request may get truncated.
    If it's incorrectly set to zero, the backend might ignore the body.
   */

    const BASE_URL = `http://localhost:${PORT}`; 
    const urlPath = req.params[0]; // Extracts the remaining URL after '/user-service/'
    const finalURL = `${BASE_URL}/${urlPath}`;
    const method = req.method.toLowerCase();
    const body = req.body;
    const query = req.query;

  const response = await axios({
    method: method,
    url: finalURL,
    data: Object.keys(body).length ? body : undefined, // Send body only if it's not empty
    params: query,
    headers: {
      ...req.headers,
      'Content-Length': body ? Buffer.byteLength(JSON.stringify(body)) : 0, // Explicitly set Content-Length
    },
    transformRequest: [(data, headers) => {       // Explicitly sets body type json
      if (!data) return data;
      headers['Content-Type'] = 'application/json';
      return JSON.stringify(data);
    }],
  });

  return response;
}

app.use('/user-service/*', async (req, res) => {     // Handles all requests starting with /user-service/ dynamically
  try {
    const response = await crossServerRequestUsingAxios(req, 8080); 
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Proxy Error',
      error: error.response?.data || error.message,
    });
  }
});


app.use('/post-service/*', async (req, res) => {     // Handles all requests starting with /user-service/ dynamically
  try {
    const response = await crossServerRequestUsingAxios(req, 8081); 
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Proxy Error',
      error: error.response?.data || error.message,
    });
  }
});


app.use('/comment-service/*', async (req, res) => {     // Handles all requests starting with /user-service/ dynamically
  try {
    const response = await crossServerRequestUsingAxios(req, 8082); 
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Proxy Error',
      error: error.response?.data || error.message,
    });
  }
});


app.use('/admin-service/*', async (req, res) => {     // Handles all requests starting with /user-service/ dynamically
  try {
    const response = await crossServerRequestUsingAxios(req, 8084); 
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Proxy Error',
      error: error.response?.data || error.message,
    });
  }
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`API Gateway started on port ${PORT}`);
});






