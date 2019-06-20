const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const engines= require('./engine').Engine;
const engine = new engines(io);

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
    let id = socket.id;
    let isP1 = false;
    let timeoutInit = null;
    let timeoutStart = null;

    if(!p1.id || !p2.id){
        if(p1.id){
            p2.id = id;
        }else {
            p1.id = id;
            isP1 = true;
        }
    }

    let params = engine.getInitParams();
    params.isP1 = isP1;
    socket.emit('INIT_PARAMS', params);

    socket.on('CONFIRM_INIT', function () {
        let player = getPlayerById(id);

        if(player != null){
            player.init = true;

            if(p1.init === true && p2.init === true){
                timeoutInit = setTimeout(function () {
                    io.emit('INICIAR', '');
                    engine.setStatus('INICIANDO');

                    timeoutStart = setTimeout(function () {
                        engine.setPlayers(p1, p2);
                        engine.start();
                    }, 2000);
                }, 1000);
            }
        }
    });

    socket.on('disconnect', function(){
        if(timeoutInit){
            clearTimeout(timeoutInit)
        }

        if(timeoutStart){
            clearTimeout(timeoutStart);
        }

        let player = getPlayerById(id);
        if(player != null){

            let status = engine.getStatus();
            if(status !== 'ESPERANDO'){
                engine.finalizaPartida();
            }

            player.init = false;
            player.id = null;
        }
    });

    socket.on('UP', function(){
        let player = getPlayerById(id);
        if(player != null){
            if(player.id === p1.id){
                engine.upP1();
            }else{
                engine.upP2();
            }
        }
    });

    socket.on('DOWN', function(){
        let player = getPlayerById(id);
        if(player != null){
            if(player.id === p1.id){
                engine.downP1();
            }else{
                engine.downP2();
            }
        }
    });

    socket.on('RESET', function(){
        engine.setStatus('ESPERANDO');
        engine.setDefault();
        socket.emit('RESET_PARAMS', engine.getRenderParams());
    });
});

http.listen(9001, function(){
    console.log('Server iniciado na porta 9001');
});