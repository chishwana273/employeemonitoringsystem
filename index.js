const express = require('express');
const app = express();
const {MongoClient} = require('mongodb');
const bodyparser = require('body-parser');
const cors =  require('cors');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(bodyparser.json());
app.use(cors());

const jwt_secret = 'Chishwana';

const uri = 'mongodb+srv://ganeshkumarmahanthi6:unis1234@unis1234.39lay.mongodb.net/'
const client = new MongoClient(uri);
const serverDb = async ()=>{
    try{
        await client.connect();
        app.listen(4000, ()=>{
            console.log("server runing at port 4000 and DB connected");
        })
    }catch(e){
        console.log(`error in intialization of server and mongodb ${e.message}`)
    }
}
 
serverDb();


const usersCollection = client.db('Unis1234')
 
//employee login and check-in time strores in database
const employeesDataBase= usersCollection.collection('employeedata');
const loginCredentials = usersCollection.collection('Users_login');
 
app.post('/login', async (req, res) => {
    const employeesDataBase= usersCollection.collection('employeedata');
    const loginCredentials = usersCollection.collection('Users_login');
    const { username, password} = req.body;
    const user = loginCredentials.find(u => u.username === username && u.password === password);
    const dateTime = new Date
    const token = jwt.sign({ username  }, jwt_secret);
    if (!user) return res.status(401).send('Invalid username or password');
    const insertData = { userName:username,checkInDate:`${dateTime.toDateString()}`, checkInTime:`${dateTime.toTimeString()}`.split( " ")[0],checkOutTime:""}
    await employeesDataBase.insertOne(insertData)
    res.send({ checkInDate:`${dateTime.toDateString()}`, checkInTime:`${dateTime.toTimeString()}`.split( " ")[0],checkOutDate:"", checkOutTime:""});
});
 
//logout timeings
 
app.put('/logout', async (req, res) => {
    const employeesDataBase= usersCollection.collection('employeedata');
    const { username} = req.body;
    const user = await employeesDataBase.findOne({ userName:username});
    const dateTime = new Date
    const updateData = { $set: { checkOutDate:`${dateTime.toDateString()}`,checkOutTime:`${dateTime.toTimeString()}`.split( " ")[0] } }
    await employeesDataBase.updateOne({ userName:username }, updateData)
    res.send({ checkOutDate:`${dateTime.toDateString()}`,checkOutTime:`${dateTime.toTimeString()}`,user});
   
});





