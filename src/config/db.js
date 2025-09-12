const mongoose = require('mongoose');

const connectDB = async () =>{
        await mongoose.connect(process.env.MONGO_URI)
}

module.exports = {connectDB};


//  const startServer  =async =>{
//     try {
//         connectDB();
//         console.log("Database connected");
//         app.listen(PORT,()=>{
//             console.log(`Server is running on port ${PORT}`);
//         })
//     } catch (error) {
//         console.log("Database connection failed",error);
//    }
// }