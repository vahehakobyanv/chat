const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const con = mongoose.createConnection('127.0.0.1:27017/home');
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
let users = con.model('users', userSchema);
let name = '';
app.get('/', function(req, res){
  let person = users.findOne({key: req.query.key});
  name = person.name;
  console.log(person.name);
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on('chat message', function(msg){
    io.emit('chat message', name+" "+msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
