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

let p1 = {
    y: 20
};
let p2 = {
    y: 20
};
io.on('connection', function(socket){
    console.log('con');

    let id = socket.id;

    if(p1.id){
        p2.id = id;
    }else {
        p1.id = id;
    }

    socket.emit('INIT_PARAMS', engine.getInitParams());

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('UP', function(msg){
        console.log(socket.id);




        console.log(p1);
        console.log(p2);

    });

    socket.on('DOWN', function(msg){
        if(id == p1.id){
            p1.y -= 5;
        }else{
            p1.y -= 5;
        }




        console.log(p1);
        console.log(p2);

    });
});

setTimeout(function () {
    console.log('Emitindo');
    io.emit('render', {p1: p1, p2: p2});
}, 10000);

http.listen(9001, function(){
    console.log('listening on *:9001');
});