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
});

socket.on('render', function (grafico) {
    console.log(grafico);
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

function render() {
    desenhaFundo();
    desenhaDivisao();

    desenhaPlayer1();
    desenhaPlayer2();
    desenhaBola();

    desenhaPontuacaoPlayer1();
    desenhaPontuacaoPlayer2();
}

/*
setTimeout(function () {
    socket.emit('teste', 'awa');
}, 3000);*/