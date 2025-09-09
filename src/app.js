const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/t',(req,res)=>{
    res.send("Hello World");
})

// app.get('/',(req,res)=>{
//     res.send("Hello from GET");
// })

app.listen(PORT,async()=>{
    console.log(`Server is running on Port ${PORT}`);
})