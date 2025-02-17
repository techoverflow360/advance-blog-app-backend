const { Client } = require('pg');
require('dotenv').config({path: '.env' });
const request = require("supertest");

/*
Issue: Jest will only run setup.js if tests are found. Since Jest isn't finding test files, setup.js isn't executing.

Execution Reaches beforeAll(async () => {...})
Jest provides beforeAll, a hook that runs once before any test suite.
Inside beforeAll, we call clearDatabase for multiple databases.

Execution Reaches clearDatabase(database, tables)
It makes client, connect and do for loop and then disconnect

Jest Starts Running Tests
After beforeAll finishes execution, Jest begins executing actual test cases.

Why is beforeAll better?
-- Jest Guarantees Execution Before Tests
-- beforeAll runs once before any test starts.
-- Ensures a consistent clean database before test execution.
-- Async Handling Ensured
-- Jest waits for beforeAll to finish before running tests.
-- No risk of database operations running while tests are executing.



*/

async function clearDatabase(database, tables) {
  const client = new Client({
    user: 'nayan',
    host: 'localhost',
    database: database,
    password: 'nayan',
    port: 5432,
  });

  await client.connect();

  for (const table of tables) {
    console.log(`Clearing table ${table} in database ${database}...`);
    
    // Use DELETE instead of TRUNCATE (avoids permission issues)
    await client.query(`DELETE FROM "${table}";`);
  }

  await client.end();
}

const authTokens = {
  user_1: null,
  user_2: null, 
  admin: null
}

const BASE_URL = {
  USER_SERVICE_URL : process.env.USER_SERVICE_URL,
  POST_SERVICE_URL : process.env.POST_SERVICE_URL,
  COMMENT_SERVICE_URL : process.env.COMMENT_SERVICE_URL,
  ADMIN_SERVICE_URL : process.env.ADMIN_SERVICE_URL
}

beforeAll(async () => {
  console.log("Clearing all tables before tests...");
  await clearDatabase('user_db', ["Bloggers"]);
  await clearDatabase('post_db', ["Posts"]);
  await clearDatabase('comment_db', ["Comments", "Replies"]);
  console.log("Database cleared successfully!");

  // register and login 2 users (Nayan2002, Abhishek2002)
  // user - 1
  const res1 = await request(BASE_URL.USER_SERVICE_URL).post("/users/register").send({
    username: "Nayan2002",
    email: "nayankumar200222@gmail.com",
    password: "N@yan2002",
  });

  const loginres1 = await request(BASE_URL.USER_SERVICE_URL).post("/users/login").send({
    email: "nayankumar200222@gmail.com",
    password: "N@yan2002"
  })

  authTokens.user_1 = loginres1.body.token;

  // user - 2;
  const res2 = await request(BASE_URL.USER_SERVICE_URL).post("/users/register").send({
    username: "Abhishek2002",
    email: "abhishekvishnoi@gmail.com",
    password: "@bhishek2002",
  });

  const loginres2 = await request(BASE_URL.USER_SERVICE_URL).post("/users/login").send({
    email: "abhishekvishnoi@gmail.com",
    password: "@bhishek2002"
  })

  authTokens.user_2 = loginres2.body.token;

  // admin 
  const loginadmin = await request(BASE_URL.USER_SERVICE_URL).post("/users/login").send({
    email : "admin@gmail.com",
    password : "admin@123"
  });

  authTokens.admin = loginadmin.body.token;

  console.log(authTokens);

}, 10000);  


global.getAuthToken = () => authTokens;
global.getServiceUrl = () => BASE_URL;

