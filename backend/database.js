const  mongoose  = require("mongoose");
//user: ferdause
//pw: 7NVKNBy22hayasGb

function DbConnect(){
    const DB_URL = process.env.DB_URL;
    //database connect
    mongoose.connect(DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open',()=>{
        console.log('DB connected');
    });
}

module.exports = DbConnect;