    var w = window.innerWidth;
    var h = window.innerHeight;
    var AMOUNT_DIAMONDS = 7;
    var timerGlobal = 25;
    var score = 0;
    var validateScore = 200;
    var initScoreDificultad = 200;
    var userText;
    var userName = '';
    var idUser = '';
    var dificultad = 1;

    if(w > 1136){
        w = 1136
        h = 800;
    }

    GamePlayManager = {
        init: function(){
        
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            this.flagFirstMouseDown = false;
            this.totalTime = timerGlobal;
            this.valueItem = [20,20,20,20,20,false,5,10];
            this.endGame = false;

        },
        preload: function(){

            var rulesImg = 'img/reglas_escritorio.jpg';
            if(w < 500){
                rulesImg = 'img/reglas_movil.jpg';
            }

            game.load.image('background', 'img/background.jpg');
            game.load.image('horse', 'img/bag.png');
            game.load.spritesheet('diamonds', 'img/esferas.png', 81, 84, 8);
            game.load.image('explosion', 'img/explosion.png');
            game.load.image('game-over', 'img/game-over.png', 100,100);
            game.load.spritesheet('button-reintentar', 'img/reintentar.png', 200, 70);
            game.load.spritesheet('button-iniciar', 'img/iniciar.png', 200, 70);
            game.load.audio('bubble', 'sound/sfxPop.mp3');
            game.load.image('rules', rulesImg);

            userName = localStorage.getItem('usuario');
            idUser = localStorage.getItem('idUsuario');
            userName = (userName) ? userName : ' ';
            idUser = (idUser) ? idUser : ' ';


        },
        create: function(){

            game.add.sprite(0, 0, 'background');

            this.soundBubble = game.add.audio('bubble');
            game.sound.setDecodedCallback([this.soundBubble], function(){}, this);

            
        //  SE AGREGAN LOS TEXTOS
            this.scoreText = this.add.text(16, 16,'Puntaje: ' + 0, { fontSize: '20px', fill: '#fff' });
            this.timerText = this.add.text(w - 50, 16,this.totalTime + '', { fontSize: '20px', fill: '#fff' });

           
            this.horse = game.add.sprite(0,0,'horse');
            this.horse.frame = 0;
            this.horse.x = game.width/2;
            this.horse.y = h - 65;
            this.horse.anchor.setTo(0.5);
            

            this.diamonds = [];
            

            for(var i = 0; i <= AMOUNT_DIAMONDS; i++){

                
                var xDiamounds = game.rnd.integerInRange(0,w - 50);
                var yDiamounds = game.rnd.integerInRange(-100,-450);
                var itemSprite = i;
                var diamond = game.add.sprite(xDiamounds,yDiamounds, 'diamonds');
                diamond.frame = itemSprite;
                diamond.isTime = (itemSprite == 6 || itemSprite == 7)? true: false;
                diamond.valueItem = this.valueItem[itemSprite];
                diamond.vel = game.rnd.realInRange(1.00,4.00);
                diamond.scale.setTo(0.80);

                this.diamonds[i] = diamond;
                
                // var rectCurrenDiamond = this.getBoundsDiamond(diamond);
                // while(this.isOverlapingOtherDiamond(i, rectCurrenDiamond)){
                //     diamond.x = game.rnd.integerInRange(50, w - 50);
                //     diamond.y = -100;
                //     rectCurrenDiamond = this.getBoundsDiamond(diamond);
                // }

            }


            this.timerGameOver = game.time.events.loop(Phaser.Timer.SECOND, function(){
                if(this.flagFirstMouseDown && !this.endGame){

                    this.totalTime--;
                    this.timerText.text = this.totalTime+'';
                    if(this.totalTime<=0){
                        
                        this.gameOver();
                    }
                    
                }
            },this);
    
           

            this.explosionGroup = game.add.group();
       
            for(var i=0; i<10; i++){
                this.explosion = this.explosionGroup.create(100,100,'explosion');
                this.explosion.tweenScale = game.add.tween(this.explosion.scale).to({
                                x: [0.4, 0.8, 0.4],
                                y: [0.4, 0.8, 0.4]
                    }, 600, Phaser.Easing.Exponential.Out, false, 0, 0, false);

                this.explosion.tweenAlpha = game.add.tween(this.explosion).to({
                                alpha: [1, 0.6, 0]
                    }, 600, Phaser.Easing.Exponential.Out, false, 0, 0, false);

                this.explosion.anchor.setTo(0.5);
                this.explosion.kill();
            }
            this.initGameRules();
            game.input.onDown.add(this.onTap, this);
            

        },
        onTap:function(){

            this.flagFirstMouseDown = true;
            
        },
        getBoundsDiamond:function(currentDiamond){
            return new Phaser.Rectangle(currentDiamond.left, currentDiamond.top, currentDiamond.width, currentDiamond.height);
        },
        isRectanglesOverlapping: function(rect1, rect2) {
            if(rect1.x> rect2.x+rect2.width || rect2.x> rect1.x+rect1.width){
                return false;
            }
            if(rect1.y> rect2.y+rect2.height || rect2.y> rect1.y+rect1.height){
                return false;
            }
            return true;
        },
        isOverlapingOtherDiamond:function(index, rect2){
            for(var i=0; i<index; i++){
                var rect1 = this.getBoundsDiamond(this.diamonds[i]);
                if(this.isRectanglesOverlapping(rect1, rect2)){
                    return true;
                }
            }
            return false;
        },
        render: function(){

            // game.debug.spriteBounds(this.diamonds[7]);
            // game.debug.spriteBounds(this.horse);

        },
        getBoundsHorse: function(){

            var x0 = this.horse.x - Math.abs(this.horse.width)/4;
            var width = Math.abs(this.horse.width)/2;
            var y0 = this.horse.y - this.horse.height/2;
            var height = this.horse.height;

            return new Phaser.Rectangle(x0,y0,width,height);

        },
        gameOver: function(){

            var alpha = game.add.bitmapData(game.width, game.height);
            alpha.ctx.fillStyle = '#000000';
            alpha.ctx.fillRect(0,0,game.width, game.height);
            var bg = game.add.sprite(0,0,alpha);
            bg.alpha = 0.8;

            this.imgGameOver = game.add.sprite(game.width/2, game.height/3, 'game-over');
            this.imgGameOver.anchor.setTo(0.5);
            this.scoreGO = this.add.text(game.width/2, (game.height/2 + 70),'Puntaje: ' + score, { fontSize: '20px', fill: '#fff' });
            this.scoreGO.anchor.setTo(0.5);
            this.playerGO = this.add.text(game.width/2, (game.height/2 + 100),'Jugador: ' + userName, { fontSize: '20px', fill: '#fff' });
            this.playerGO.anchor.setTo(0.5);

            this.btnReintentar = game.add.button(game.width/2, game.height/2 + 150, 'button-reintentar', this.actionOnClick, this, 2, 1, 0);
            this.btnReintentar.anchor.setTo(0.5);
            game.time.events.remove(this.timerGameOver);
            this.endGame = true;

            // let urlService = $('#urlService').val() + 'score/insertScore';
            // $.ajax({
            // type: "POST",
            // async: true,
            // url: urlService,
            // data: {
            //     "ID": idUser,
            //     "NOMBRE": userName,
            //     "PUNTUACION": score
            // },
            // success: function(res){

            //     console.log(res);

            // },
            // dataType: 'JSON'
            // });
        },
        initGameRules: function(){
            var wrules = game.width / 6;
            var hrules = game.height / 7;

            var fondoReglas = game.add.bitmapData(game.width, game.height);
            fondoReglas.ctx.fillStyle = '#000000';
            fondoReglas.ctx.fillRect(0,0,game.width, game.height);
            this.bgr = game.add.sprite(0,0,fondoReglas);
            this.bgr.alpha = 0.8;

            this.backgroundRules = game.add.sprite(wrules,hrules,'rules');

            this.btnCloseRules = game.add.button(0, 0, 'button-iniciar', this.initGame, this), 2,1,0;
            this.btnCloseRules.x = game.width / 2;
            this.btnCloseRules.y = game.height - h/2.6;
            this.btnCloseRules.anchor.setTo(0.5);
            this.endGame = true;
        },
        actionOnClick: function(){

            location.reload();

        },
        initGame: function(){

            this.backgroundRules.visible = false;
            this.btnCloseRules.visible = false;
            this.bgr.visible = false;
            this.endGame = false;
        },
        update: function(){
            if(this.flagFirstMouseDown && !this.endGame){

                var pointerX = game.input.x;
                var pointerY = game.input.y;
    
                var distX = pointerX - this.horse.x;
                var distY = pointerY - this.horse.y;
    
                if(distX>0){
                    this.horse.scale.setTo(1,1);
                }else{
                    this.horse.scale.setTo(-1,1);
                }
    
                this.horse.x += distX * 0.7;
                // this.horse.y += distY * 0.05;


                for(var i = 0; i <= AMOUNT_DIAMONDS; i++){

                    var diamond = this.diamonds[i];


                    
                    // if(diamond.isTime){

                        diamond.y += diamond.vel + dificultad;
                        if(diamond.y > h + 100){
                            diamond.y = -100;
                            diamond.x = game.rnd.integerInRange(0,w - 50);
                            diamond.visible = true;
                        }

                    // }

                    var rectHorse = this.getBoundsHorse();
                    var rectDiamond = this.getBoundsDiamond(diamond);
                    
                    if(diamond.visible && this.isRectanglesOverlapping(rectHorse, rectDiamond)){

                        this.soundBubble.play();

                        if(!diamond.valueItem){

                           this.gameOver();

                        }
                        if(diamond.isTime){
                            this.totalTime += diamond.valueItem;
                        }else{

                            score += diamond.valueItem;
                            this.scoreText.setText('Score: ' + score);

                        }
                        
                        diamond.visible = false;

                        if(score > validateScore){
                            dificultad += game.rnd.realInRange(1.00,2.00);
                            validateScore += initScoreDificultad;
                        }

                        var explosion = this.explosionGroup.getFirstDead();
                        if(explosion!=null){
                            explosion.reset(this.diamonds[i].x, this.diamonds[i].y);
                            explosion.tweenScale.start();
                            explosion.tweenAlpha.start();
                            
                            explosion.tweenAlpha.onComplete.add(function (currentTarget, currentTween) {

                                currentTarget.kill();
                               
                            }, this);
                        }
                        
                    }

                }
            }
        }
    }
    var game = new Phaser.Game(w, h, Phaser.CANVAS);
    game.state.add('gameplay', GamePlayManager);

    $(function () {

        game.state.start('gameplay');

   });
