const bcrypt = require('bcrypt');

const hashPassword= async(password)=>{
const hashedPassword = await bcrypt.hash(password, 10);
return hashedPassword;
}

const comparedPassword = async(reqPassword,dbpassword)=>{
    const decoded = bcrypt.compare(reqPassword, dbpassword);
    return decoded
}
    

module.exports = {hashPassword,comparedPassword}