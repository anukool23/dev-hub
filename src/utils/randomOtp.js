const randomNumber = ()=>{
    const number = Math.floor(1000 + Math.random() * 9000);
    return number
}

module.exports = {randomNumber}