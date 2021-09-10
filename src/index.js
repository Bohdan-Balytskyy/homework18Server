const express = require('express');
const app = express();

const myPassport = require('./app/components/my_modules/passport');

app.use((req, res, next) => {         
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT,PATCH');
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type');
  // res.header('Access-Control-Allow-Credentials', true);
  // res.header('Access-Control-Max-Age', '86400');
  next();
});

app.use(myPassport.initialize);       
myPassport.passportUse();
            
app.use('/uploads', express.static('src/app/components/uploads'));   //+
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello World");
});

const mainRoute = require('./app/routes/main.route');   
app.use('/', mainRoute);  

app.listen('5000',() => {
    console.log(`Server is listening on port 5000`);
});
