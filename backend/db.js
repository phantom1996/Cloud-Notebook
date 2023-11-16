const mongoose =  require('mongoose');

const mongoURI = "mongodb://localhost:27017/cloudnotebook"

const connectToMongo =()=> {
    mongoose.connect(mongoURI).then(()=>{
        console.log("Connected to DB")
    }).catch((e) => {
        console.log(e)
    })
}

module.exports = connectToMongo;    

