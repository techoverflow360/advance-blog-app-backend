const express=require('express')
const cors=require('cors');
const bodyparser=require('body-parser');
require('dotenv').config();
const routes=require('./routes/adminRoutes')
const app=express()
const {authenticateUser,adminAuthenticate}=require('./utils/utils')

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

app.use('/admin', authenticateUser, adminAuthenticate, routes);

app.listen(process.env.PORT,()=>{
    console.log(`admin server started at port ${process.env.PORT}`);
})
