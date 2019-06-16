class Engine {

    constructor(){
        this.setDefault();
        this.status = 'ESPERANDO';
    }

    getStatus(){
        return this.status;
    }

    setStatus(status){
        this.status = status;
    }

    setDefault(){
        this.ALTURA = 550;
        this.LARGURA = 800;

        this.ALTURA_PLAYER = 100;
        this.LARGURA_PLAYER = 10;
        this.X_PLAYER = 40;

        this.TAMANHO_BOLA = 18;

        this.ALTURA_PONTUACAO = 50;

        this.ALTURA_TRACO = 10;
        this.LARGURA_TRACO = 3.5;


        this.player1Y = (this.ALTURA / 2) - (this.ALTURA_PLAYER / 2);
        this.player2Y = (this.ALTURA / 2) - (this.ALTURA_PLAYER / 2);

        this.pontuacaoP1 = 0;
        this.pontuacaoP2 = 0;

        this.bolaX = (this.LARGURA / 2) - (this.TAMANHO_BOLA / 2);
        this.bolaY = (this.ALTURA / 2) - (this.TAMANHO_BOLA / 2);
    }

    getInitParams(){
        return this;
    }

    start(io){
        io.emit('JOGAR', '');
    }
}

module.exports.Engine = Engine;