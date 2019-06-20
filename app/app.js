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
let filaEspera = []; //Players aguardando para jogar

function getPlayerById(id){
    if(p1.id === id){
        return p1;
    }else if(p2.id === id){
        return p2;
    }else{
        return null;
    }
}

function getPosPlayerAguardandoById(id){
    if(filaEspera.length){
        for(let i=0; i<filaEspera.length; i++){
            if(filaEspera[i] === id){
                return i;
            }
        }
    }

    return null
}

io.on('connection', function(socket){
    let id = socket.id;
    let isP1 = false;
    let timeoutInit = null;
    let timeoutStart = null;

    let entrouNaFila = false;
    if(!p1.id || !p2.id){
        if(p1.id){
            p2.id = id;
        }else {
            p1.id = id;
            isP1 = true;
        }
    }else{
        filaEspera.push(id);
        entrouNaFila = true;
    }

    let params = engine.getInitParams();

    if(entrouNaFila){
        params.entrouNaFila = entrouNaFila;
    }else{
        params.isP1 = isP1;
    }
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

            if(filaEspera.length){
                let prox = filaEspera.shift();

                if(player.id === p1.id){ //Removido foi o P1
                    p1.id = prox;
                    isP1 = true;
                }else{
                    p2.id = prox;
                    isP1 = false;
                }

                io.to(prox).emit('SAI_FILA', {isP1: isP1, status: 'FIM'});
            }else{
                player.id = null;
            }
        }else{
            let i = getPosPlayerAguardandoById(id);
            if(i != null){
                filaEspera.splice(i, 1);
            }
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