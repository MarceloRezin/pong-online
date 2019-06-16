class Engine {

    constructor(){
        this.setDefault();

        this.VELOCIDADE_BOLA = 10;
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

    getRandomAngulo(min, max) {

        if(min == null || min < 0){
            min = 0;
        }

        if(max == null || max > 360){
            max = 360;
        }

        return Math.random() * (max - min) + min;
    }

    // X = raio * cos(angulo)
    toXPolar(raio, angulo){
        return raio * Math.cos( angulo *Math.PI/180 );
        return raio * Math.cos(angulo);
    }

    // Y = r . sin(angulo)
    toYPolar(raio, angulo){
        return raio * Math.sin( angulo * Math.PI/180 );
    }

    toRaioCartesiano(x, y){
        return Math.sqrt((x * x) + (y*y));
    }

    toAnguloCartesiano(x, y){
        return Math.atan2( y , x ) * 180.0/Math.PI;
    }


    start(io){
        this.io = io;
        this.io.emit('JOGAR', '');

        this.definirDirecaoBola();

        this.render();
    }

    render(){

        this.moveBola();

        this.io.emit('RENDER', this.getRenderParams());

        setTimeout(this.render.bind(this), 50);
    }

    definirDirecaoBola(){
        this.DIRECAO_ATUAL = this.getRandomAngulo(null, null);
    }

    moveBola(){
        this.bolaX = this.bolaX + this.toXPolar(this.VELOCIDADE_BOLA, this.DIRECAO_ATUAL);
        this.bolaY = this.bolaY + this.toYPolar(this.VELOCIDADE_BOLA, this.DIRECAO_ATUAL);
    }

    getRenderParams(){
        return {
            bolaX: this.bolaX,
            bolaY: this.bolaY
        };
    }
}

module.exports.Engine = Engine;