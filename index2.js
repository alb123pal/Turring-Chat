var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
mongo = require('mongodb').MongoClient;
var cleverbot = require("cleverbot.io"),
bot = new cleverbot("iCVb1TCrc3baEnNa", "RLlhCsPMLZFkBPz64S74jUHiFyLcVt3c");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/bootstrap1.html');
});

mongoose.connect('mongodb://127.0.0.1/test');
mongo.connect('mongodb://127.0.0.1/test', function(err, db){
  if(err) throw err;

var room = 0;

io.on('connection', function(socket){

    var col2 = mongoose.connection;
    var col = db.collection('messages');

    col.find().toArray(function(err, res){
    if(err) throw err;
    
    });
        if((io.sockets.sockets.length%2) === 1)
        {
            room++;        
        }   
    socket.join("room"+ room);
    const IdRoom = room;

    console.log("Id user: " + io.sockets.sockets.length + " Room:" + room);

     socket.on('mssage', function(msg){
        console.log('message: ' + msg);
   
    var whitespacePattern = /^\s*$/;
 
    if(whitespacePattern.test(msg)) {
         io.in('room' + IdRoom).emit('er', 'Wiadomość i nazwa użytkownika nie może być pusta');
         
     }
     
     else{

        //  col.insert({message: msg});
          io.in('room'+ IdRoom).emit('mssage', msg);
              col.find().toArray(function(err, res){
                if(err) throw err;
            // var randomNumber = Math.floor((Math.random() * 25 ) + 5);
            // console.log(res.length);
            // setTimeout(function () {
            //     socket.emit('output', res);
            // }, randomNumber);
    });
     }
   
  });

  socket.on('emitToBoot', function(query){
    console.log('message from emitToBoot:' + query);
    bot.setNick("sessionname");
    bot.create(function (err, sessionname){
      bot.ask(query, function(err, response){
        console.log('cleverbot: ' + response);
        io.in('room'+ IdRoom).emit('emitToBoot', query);
        setTimeout(function () {
          io.in('room'+ IdRoom).emit('responseBoot', response);
        }, 2000);
      });
    });
  });

  socket.on('clientAnswer', function(data){
    console.log('Client answer : ' + data);
    var Schema = mongoose.Schema;
    var answerSchema = new Schema({
      answer: String
    });
    var Answer = mongoose.model('Answer', answerSchema);
    var clientA = new Answer({
      answer: data
    });
   
    clientA.save(function(err, x){
    if(err) return console.error(err);
    console.log('Answer add successfully');
});

  });

    socket.on('disconnect', function(){
    console.log('user disconnected');
    
   });

 });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
