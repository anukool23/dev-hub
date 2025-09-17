const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.router");
const profileRouter = require("./routes/profile.router");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middlewares/error");
const { requestRouter } = require("./routes/request.router");
const { userRouter } = require("./routes/user.routes");

const app = express();
require("dotenv").config();


const PORT = process.env.PORT || 3000; 

// Middleware to parse JSON bodies
app.use(express.json()); 
app.use(cookieParser())
app.use(cors())


app.use('/auth',authRouter)
app.use('/profile',profileRouter);
app.use('/connection',requestRouter)
app.use('/user',userRouter)


app.use("/", errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ Database connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    }
};

startServer();
