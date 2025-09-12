const authAdmin = (req,res,next)=>{
    const token = req.headers['token'];
    if(token === "admin123"){
        next();
    }else{
        res.status(403).send("Forbidden: Admins only");
    }
}

module.exports = { authAdmin };