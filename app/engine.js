class Engine {

    constructor(io){
        this.setDefault();
        this.VELOCIDADE_BOLA = 20;
        this.PASSO_PLAYER = 60;
        this.io = io;
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

        this.vitoriaP1 = null;

        this.resetBola();

        this.status = 'ESPERANDO';
    }

    getInitParams(){
        return {
            ALTURA: this.ALTURA,
            LARGURA: this.LARGURA,

            ALTURA_PLAYER: this.ALTURA_PLAYER,
            LARGURA_PLAYER: this.LARGURA_PLAYER,
            X_PLAYER: this.X_PLAYER,

            TAMANHO_BOLA: this.TAMANHO_BOLA,

            ALTURA_PONTUACAO: this.ALTURA_PONTUACAO,

            ALTURA_TRACO: this.ALTURA_TRACO,
            LARGURA_TRACO : this.LARGURA_TRACO,

            player1Y: this.player1Y,
            player2Y: this.player2Y,

            pontuacaoP1: this.pontuacaoP1,
            pontuacaoP2: this.pontuacaoP2,

            bolaX: this.bolaX,
            bolaY: this.bolaY,
        };
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
        return raio * Math.cos( angulo * Math.PI/180 );
    }

    // Y = r . sin(angulo)
    toYPolar(raio, angulo){
        return raio * Math.sin( angulo * Math.PI/180 );
    }

    start(){
        this.io.emit('JOGAR', '');
        this.status = 'JOGANDO';

        this.MAIN_LOOP = setInterval(this.render.bind(this), 50);
    }

    render(){

        this.checkLimitesBola();
        this.checkFim();
        this.moveBola();

        this.io.emit('RENDER', this.getRenderParams());
    }

    definirDirecaoBola(min, max){
        this.DIRECAO_ATUAL = this.getRandomAngulo(min, max);
    }

    getRenderParams(){
        return {
            bolaX: this.bolaX,
            bolaY: this.bolaY,
            pontuacaoP1: this.pontuacaoP1,
            pontuacaoP2: this.pontuacaoP2,
            player1Y: this.player1Y,
            player2Y: this.player2Y
        };
    }

    moveBola(){
        this.bolaX = this.bolaX + this.toXPolar(this.VELOCIDADE_BOLA, this.DIRECAO_ATUAL);
        this.bolaY = this.bolaY + this.toYPolar(this.VELOCIDADE_BOLA, this.DIRECAO_ATUAL);
    }

    resetBola(){
        this.definirDirecaoBola(0, 360);
        this.bolaX = (this.LARGURA / 2) - (this.TAMANHO_BOLA / 2);
        this.bolaY = (this.ALTURA / 2) - (this.TAMANHO_BOLA / 2);
    }

    checkLimitesBola(){
        if(this.bolaX < this.X_PLAYER + this.LARGURA_PLAYER){
            if(this.bolaY + this.TAMANHO_BOLA < this.player1Y || this.bolaY > this.player1Y + this.ALTURA_PLAYER){ //Fora do player
                //Pontuação do P2
                this.pontuacaoP2++;
                this.resetBola();
            }else{
                //Bateu no p1;
                // 0 - 90 -- 270 - 360
                if(this.getRandomAngulo(0, 2) < 1){
                    this.definirDirecaoBola(12, 78);
                }else{
                    this.definirDirecaoBola(282, 358);
                }
            }
        }else if(this.bolaX + this.TAMANHO_BOLA > this.LARGURA - this.LARGURA_PLAYER - this.X_PLAYER){
            if(this.bolaY + this.TAMANHO_BOLA < this.player2Y || this.bolaY > this.player2Y + this.ALTURA_PLAYER){ //Fora do player
                //Pontuação do P1
                this.pontuacaoP1++;
                this.resetBola();
            }else{
                // Bateu no p2
                //90 - 270
                this.definirDirecaoBola(102, 258);
            }
        }else if(this.bolaY < 1){ //Cima
            this.definirDirecaoBola(0, 180);
        }else if(this.bolaY + this.TAMANHO_BOLA > this.ALTURA){ //Baixo
            this.definirDirecaoBola(180, 360);
        }
    }

    upP1(){
        if(this.player1Y <= this.PASSO_PLAYER){
            this.player1Y = 0;
        }else{
            this.player1Y-=this.PASSO_PLAYER;
        }
    }

    downP1(){
        if(this.player1Y + this.ALTURA_PLAYER >= this.ALTURA - this.PASSO_PLAYER){
            this.player1Y = this.ALTURA - this.ALTURA_PLAYER;
        }else{
            this.player1Y+=this.PASSO_PLAYER;
        }
    }

    upP2(){
        if(this.player2Y <= this.PASSO_PLAYER){
            this.player2Y = 0;
        }else{
            this.player2Y-=this.PASSO_PLAYER;
        }
    }

    downP2(){
        if(this.player2Y + this.ALTURA_PLAYER >= this.ALTURA - this.PASSO_PLAYER){
            this.player2Y = this.ALTURA - this.ALTURA_PLAYER;
        }else{
            this.player2Y+=this.PASSO_PLAYER;
        }
    }

    checkFim(){

        let fim = false;
        if(this.pontuacaoP1 > 9){
            this.vitoriaP1 = true;
            fim = true;
        } else if(this.pontuacaoP2 > 9){
            this.vitoriaP1 = false;
            fim = true;
        }

        if(fim){
            this.finalizaPartida();

            this.p1.init = false;
            this.p2.init = false;
        }
    }

    finalizaPartida(){
        this.status = "FIM";
        clearInterval(this.MAIN_LOOP);
        this.io.emit('FIM', {vitoriaP1: this.vitoriaP1});
    }

    setPlayers(p1, p2){
        this.p1 = p1;
        this.p2 = p2;
    }
}

module.exports.Engine = Engine;