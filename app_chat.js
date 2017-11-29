const WebSocket = require('ws');
const mongoose = require('mongoose');
const con = mongoose.createConnection('127.0.0.1:27017/home');
const wss = new WebSocket.Server({port: 3001});
let conections = [];
const keygen = require('keygenerator');
const Schema = mongoose.Schema;


function generateAPIKey() {
  return (keygen._({length: 2}) + '-' + keygen._({length: 6})
        + '-' + keygen.number()
        + '-' + keygen._({length: 6})
        + '-' + keygen._({length: 8})).replace(/&/g, '');
}

let userSchema = Schema({
  key: {
      type: String,
      default: generateAPIKey
  },

  username: {
      type: String,
      index: {unique: true}
  },

  age: {
      type: Number,
      default: null
  },

  password: {
      type: String
  },

  email: {
      type: String,
      lowercase: true
  },

  name: {
      type: String,
      default: null
  },

  role: {
      type: String,
      enum: ['user','admin'],
      default: 'user'
  },
});
let users = mongoose.model('users', userSchema);
name = 'vahe';
wss.on('connection', ws => {

  conections.push(ws);
	ws.send('welcome!');
	ws.on('message', msg => {
    users.findOne({key:'ug-Hyci8z-78977626-Q3CBsl-K92Ta8Gx'},(err,data)=>{
      console.log(data.username);
      name = data.username;
    })
		conections.forEach(con=> {
      con.send(name+' '+msg);
    })
	});
});
