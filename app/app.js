const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const engines= require('./engine').Engine;
const engine = new engines();

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(path.resolve( 'public/index.html'));
});

let p1 = {};
let p2 = {};

function getPlayerById(id){
    if(p1.id === id){
        return p1;
    }else if(p2.id === id){
        return p2;
    }else{
        return null;
    }
}

io.on('connection', function(socket){
    console.log('con');

    let id = socket.id;

    if(!p1.id || !p2.id){
        if(p1.id){
            p2.id = id;
        }else {
            p1.id = id;
        }
    }

    socket.emit('INIT_PARAMS', engine.getInitParams());

    socket.on('disconnect', function(){
        console.log('user disconnected');
        //TODO Remover player
    });

    socket.on('UP', function(msg){
    });

    socket.on('DOWN', function(msg){
    });
});

http.listen(9001, function(){
    console.log('listening on *:9001');
});