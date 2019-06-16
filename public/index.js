var canvas;
var ctx;

var ALTURA;
var LARGURA;

var ALTURA_PLAYER;
var LARGURA_PLAYER;
var X_PLAYER;

const BRANCO = '#FFFFFF';
const PRETO = '#000000';

var TAMANHO_BOLA;

const FONTE_PONTUACAO = '48px Courier New';
var ALTURA_PONTUACAO;

var ALTURA_TRACO;
var LARGURA_TRACO;

var player1Y;
var player2Y;

var pontuacaoP1;
var pontuacaoP2;

var bolaX;
var bolaY;

var enumStatus = {
  ESPERANDO: 'ESPERANDO',
  INICIANDO: 'INICIANDO',
  JOGANDO: 'JOGANDO'
};

var status = enumStatus.ESPERANDO;


var loader = [
  [PRETO, '#28292f', '#28292f', '#28292f'],
  ['#28292f', PRETO, '#28292f', '#28292f'],
  ['#28292f', '#28292f', '#28292f', PRETO],
  ['#28292f', '#28292f', PRETO, '#28292f']
];
var posLoader = 0;
const TAMALHO_LOADER = 40;

var socket = io();

socket.on('INIT_PARAMS', function (params) {
    // console.log(params);

    ALTURA = params.ALTURA;
    LARGURA = params.LARGURA;

    ALTURA_PLAYER = params.ALTURA_PLAYER;
    LARGURA_PLAYER = params.LARGURA_PLAYER;
    X_PLAYER = params.X_PLAYER;

    TAMANHO_BOLA = params.TAMANHO_BOLA;

    ALTURA_PONTUACAO = params.ALTURA_PONTUACAO;

    ALTURA_TRACO = params.ALTURA_TRACO;
    LARGURA_TRACO = params.LARGURA_TRACO;

    player1Y = params.player1Y;
    player2Y = params.player2Y;

    pontuacaoP1 = params.pontuacaoP1;
    pontuacaoP2 = params.pontuacaoP2;

    bolaX = params.bolaX;
    bolaY = params.bolaY;

    init();
    render();

    socket.emit('CONFIRM_INIT', 'true');
});

socket.on('INICIAR', function () {
    console.log('ola');
    status = enumStatus.INICIANDO;
    render();
});

socket.on('JOGAR', function () {
    console.log('Jogando');
    status = enumStatus.JOGANDO;
    render();
});

function init(){
    canvas = document.getElementById('canvas');
    canvas.style.border = "1px solid #000";
    canvas.width = LARGURA;
    canvas.height = ALTURA;

    ctx = canvas.getContext('2d');

    document.onkeydown = function (e) {
        if(e.keyCode === 38){
            socket.emit('UP', '');
        }else if(e.keyCode === 40){
            socket.emit('DOWN', '');
        }
    };
}

function desenhaFundo() {
    ctx.fillStyle = PRETO;
    ctx.fillRect (0, 0, LARGURA, ALTURA);
}

function desenhaPlayer1() {
    ctx.fillStyle = BRANCO;
    ctx.fillRect (X_PLAYER, player1Y, LARGURA_PLAYER, ALTURA_PLAYER);
}

function desenhaPlayer2() {
    ctx.fillStyle = BRANCO;
    ctx.fillRect (LARGURA - LARGURA_PLAYER - X_PLAYER, player2Y, LARGURA_PLAYER, ALTURA_PLAYER);
}

function desenhaBola() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bolaX, bolaY, TAMANHO_BOLA, TAMANHO_BOLA)
}

function desenhaPontuacaoPlayer1() {
    ctx.font = FONTE_PONTUACAO;
    ctx.fillText(pontuacaoP1, LARGURA / 2 - 60, ALTURA_PONTUACAO);
}

function desenhaPontuacaoPlayer2() {
    ctx.font = FONTE_PONTUACAO;
    ctx.fillText(pontuacaoP2, LARGURA / 2 + 30, ALTURA_PONTUACAO);
}

function desenhaDivisao() {
    ctx.fillStyle = "rgba(255,255,255,0.3)";

    for(let i=0, y=2; i<ALTURA / ALTURA_TRACO; i++, y+=20){
        ctx.fillRect ((LARGURA / 2) - (LARGURA_TRACO / 2), y, LARGURA_TRACO, ALTURA_TRACO);
    }
}

function fundoBranco() {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect (0, 0, LARGURA, ALTURA);
}

function desenhaLoadScreen() {
    fundoBranco();

    ctx.fillStyle = PRETO;
    ctx.font = '30px Courier New';
    ctx.fillText('Esperando outro player, aguarde ...', 100, ALTURA / 2 + 50);

    var matrizCor = loader[posLoader];

    ctx.fillStyle = matrizCor[0];
    ctx.fillRect(LARGURA / 2 - 84, ALTURA / 2 - 60, TAMALHO_LOADER, TAMALHO_LOADER);

    ctx.fillStyle = matrizCor[1];
    ctx.fillRect(LARGURA / 2 - 41, ALTURA / 2 - 60, TAMALHO_LOADER, TAMALHO_LOADER);

    ctx.fillStyle = matrizCor[2];
    ctx.fillRect(LARGURA / 2  + 1, ALTURA / 2 - 60, TAMALHO_LOADER, TAMALHO_LOADER);

    ctx.fillStyle = matrizCor[3];
    ctx.fillRect(LARGURA / 2  + 44, ALTURA / 2 - 60, TAMALHO_LOADER, TAMALHO_LOADER);

    posLoader ++;

    if(posLoader === loader.length){
        posLoader = 0;
    }
}

function desenhaStartScreen() {
    fundoBranco();

    ctx.fillStyle = PRETO;
    ctx.font = '30px Courier New';
    ctx.fillText('Atenção! A partida vai iniciar.', 150, ALTURA / 2);
}

function render() {
    desenhaFundo();
    desenhaDivisao();

    desenhaPlayer1();
    desenhaPlayer2();
    desenhaBola();

    desenhaPontuacaoPlayer1();
    desenhaPontuacaoPlayer2();

    if(status === enumStatus.ESPERANDO){
        desenhaLoadScreen();
        setTimeout(render, 100); //10 FPS
    }

    if(status === enumStatus.INICIANDO){
        desenhaStartScreen();
        setTimeout(render, 100); //10 FPS
    }
}

/*
setTimeout(function () {
    socket.emit('teste', 'awa');
}, 3000);*/