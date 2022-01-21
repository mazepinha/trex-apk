var trex, trex_running,trex_morto, edges;
var groundImage,ground, chaoInvisivel;
var nuvens, nuvemimg, grupo_nuv;
var obstaculo1,obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6,grupo_obst;
var score,highscore;
var PLAY =1;
var FIM =0;
var estadojogo =PLAY;
var gameover,gameoverImg;
var restart, restartImg;
var som_pulo, som_checkPoint, som_morto

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png")
  nuvemimg = loadImage("cloud.png");
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  trex_morto = loadAnimation("trex_collided.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  som_pulo = loadSound("som_pular.mp3");
  som_checkPoint = loadSound("som_100pontos.mp3");
  som_morto = loadSound("som_morrer.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //criando o trex
  trex = createSprite(50,height/2-10,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("morto",trex_morto);
  edges = createEdgeSprites();
  
  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50;


  //criando sprite do chão
  ground =createSprite(width/2,height/2,400,20);
  ground.addImage(groundImage);

  //chão invisivel
  chaoInvisivel=createSprite(width/2,height/2+8,width,10);
  chaoInvisivel.visible=false;  

  //criando os grupos: obstaculos e nuvens.
  grupo_nuv =createGroup();
  grupo_obst =createGroup();

  //pontuação
  score = 0

  trex.setCollider("rectangle",0,0,trex.width,trex.height);

  //criar gameover e restart
  gameover = createSprite (width/2,height/3-50);
  gameover.addImage(gameoverImg);
  gameover.scale=0.5

  restart = createSprite (width/2,height/3);
  restart.addImage(restartImg);
  restart.scale=0.5;

}

function draw(){
  //definir a cor do plano de fundo 
  background("white");
  textSize(20);
  fill("black");
 text("score: " +score, width/2,50);


if (estadojogo == PLAY){

  //deixar invisivel o gameover e o restart.
  gameover.visible=false;
  restart.visible=false;

  score=score +Math.round(getFrameRate()/60);

   //chão infinito
   ground.velocityX=-(4+score/400);
  if (ground.x < width*0.2){
    ground.x=ground.width/2;
    }

    //pular quando a seta for pressionada
  if  (touches.legth >0 || keyDown("Space") && trex.y > height/2-50){
    //retiramos o pulo duplo, mudando a altura permitida para altura do trex
    trex.velocityY = -14 ;
    som_pulo.play();
    touches=[];
  }


  trex.velocityY = trex.velocityY + 1;

  //criar nuvens
  criarnuvens();
  
  //criar obsstaculos
  criar_obstaculos();

  if(score>0 && score%100==0){
    som_checkPoint.play();
  }

  
  //colisão do trex para acabar o jogo
  if (grupo_obst.isTouching(trex)){
    estadojogo = FIM;   
    som_morto.play();
  }
  
}
else if(estadojogo == FIM){

  //deixar visivel o gameover e o restart.
  gameover.visible=true;
  restart.visible=true;

  trex.changeAnimation("morto",trex_morto);
  ground.velocityX=0;
  grupo_nuv.setVelocityXEach(0);
  grupo_obst.setVelocityXEach(0);
  trex.velocityY=0
  //definir tempo de vida
  grupo_nuv.setLifetimeEach(-4);
  grupo_obst.setLifetimeEach(-4);

  if (mousePressedOver(restart) || touches.length>0){
  reset();
  touches=[];

  }
}

  
 //impedir que o trex caia
  trex.collide(chaoInvisivel);
  
  
  drawSprites();
}

  function criarnuvens(){
   if (frameCount % 125 == 0){
    nuvens =createSprite(width,height/2,40,10);
    nuvens.addImage(nuvemimg); 
    nuvens.y =Math.round(random(10,height/3));
    nuvens.velocityX=-2; 
    var num =Math.round(random(5,8));
    nuvens.scale =num/10;

    //ajuste de prufundidade
  nuvens.depth=trex.depth;
  trex.depth=trex.depth+1;
  
  //tempo de vida nuvens
  nuvens.lifetime=width+40;
  
  //adicionar nuvens ao grupo
  grupo_nuv.add(nuvens);
}
  }
  
  //criar obstaculos
  function criar_obstaculos(){  
 if (frameCount % 65 == 0){
    obstaculo =createSprite(width+20,height/2-12,10,40);
    obstaculo.velocityX=-(5+score/400);

  //criar obstaculos aleatoriamente
  var numero =Math.round(random(1,6))
    switch(numero){
      case 1: obstaculo.addImage(obstaculo1);
        break;
      case 2: obstaculo.addImage(obstaculo2);
        break;
      case 3: obstaculo.addImage(obstaculo3);
        break;
      case 4: obstaculo.addImage(obstaculo4);
        break;
      case 5: obstaculo.addImage(obstaculo5);
        break;
      case 6: obstaculo.addImage(obstaculo6);
        break;
      default:
        break;
  }
obstaculo.scale=0.4;
obstaculo.lifetime=width+40;
grupo_obst.add(obstaculo);
 }  
}

function reset(){

score=0;
estadojogo = PLAY;
grupo_nuv.destroyEach();
grupo_obst.destroyEach();
gameover.visible=false;
restart.visible=false;
trex.changeAnimation("running", trex_running);
}