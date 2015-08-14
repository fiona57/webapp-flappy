// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 500;
var jumpPower = 200;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);
var score=0;
score=0;
var labelScore;
var player1;
var player2;
var pipes = [];
var gapSize=100;
var gapMargin=50;
var blockHeight=50;
var pipeEndHeight=25;
var pipeEndExtraWidth=10;
var balloons=[];
var weights=[];
var splashDisplay

$("#greeting-form").on("submit", function(event_details) {
    var greeting ="Hello ";
    //$ replaces jQuery
    var name = $("#fullName").val();
    var email = $("#email").val();
    var score = $("#score").val();
    var greeting_message = greeting +  name + email +  score ;
    $("#greeting-form").fadeOut();
    $("#greeting").append("<p>"+ greeting_message+"</p>").fadeIn;
    event_details.preventDefault();
});
/*
 * Loads all resources for the game and gives them names.
 */
function preload()
{
    game.load.image("player1Img","../assets/butterfly.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("player2Img","../assets/bunny.png");
    game.load.image("pipe","../assets/pipe.png");
    game.load.image("grass","../assets/grass.png");
    game.load.image("pipeend","../assets/pipe-end.png");
    game.load.image("balloons","../assets/wings.png");
    game.load.image("weights","../assets/logs.png")
    game.load.image("welcometree","../assets/welcometree.png")
}

/*
 * Initialises the game. This function is only called once.
 */
function create()
{

    //game.stage.setBackgroundColor ("#99FF99");
    var background = game.add.image(0,0, "grass");
    background.width = 800;
    background.height = 400;

    //game.add.text(50,190, "Welcome to my AWESOME game",
       // {font:"40px SPCaesarea", fill:"#CC00CC"});

   player1 = game.add.sprite(10,20, "player1Img");
    player1.scale.x = 0.15;
    player1.scale.y = 0.15;
    player1.x=175;
    player1.y=100;

    player2 = game.add.sprite(10,200, "player2Img");
    player2.scale.x = 0.15;
    player2.scale.y = 0.15;
    player2.x=175;
    player2.y=100;
   // game.input
      //  .onDown
      //  .add(clickHandler);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player1);
    game.physics.arcade.enable(player2);


    splashDisplay=game.add.image(120,40,"welcometree");

    game.input.keyboard
        .addKey(Phaser.Keyboard.ENTER)
        .onDown.add(start);

}
function start(){
    splashDisplay.destroy();
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.NUMPAD_0)
        .onDown.add(spaceHandler);
    //alert(score);
    labelScore = game.add.text(700,20, "0");

    player1.body.velocity.x = 0;
    player2.body.velocity.x = 0;

    player1.body.gravity.y = gameGravity;
    player2.body.gravity.y = gameGravity;

    game.input.keyboard
        .addKey(Phaser.Keyboard.NUMPAD_0)
        .onDown.add(function(){
            player1.body.velocity.y=-jumpPower;
        });
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(player2jump);



    pipeInterval = 1.5;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generate);


    player1.anchor.setTo(0.5,0.5);
    player2.anchor.setTo(0.5,0.5);
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);

}
function clickHandler(event)
{
    alert(game.add.sprite(event.x,event.y, "playerImg"));
}
function spaceHandler()
    {
        game.sound.play("score");
    }
function player1jump()
{
    player1.body.velocity.y = -jumpPower;
}
function player2jump()
{
 player2.body.velocity.y = -jumpPower;
}

function generatepipe()
{
    var gapStart = game.rnd.integerInRange(gapMargin, height-gapSize-gapMargin);
//gapStart is the distance between the top of the canvas and the top of the gap in the pipe.
    addPipeEnd(width-(pipeEndExtraWidth/2), gapStart-pipeEndHeight);
    for(var y=gapStart-pipeEndHeight; y>0 ; y-=blockHeight) {
        // y is the coordinate of the bottom of the block, subtract blockHeight
        // to get the top
        addPipeBlock(width,y - blockHeight);
    }

    addPipeEnd(width-(pipeEndExtraWidth/2), gapStart+gapSize);
    for(var y=gapStart+gapSize+pipeEndHeight; y<height; y+=blockHeight) {
        addPipeBlock(width,y);
    }

    changeScore();
}
function addPipeEnd(x, y) {
    var block = game.add.sprite(x, y, "pipeend");
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -gameSpeed;
}
function addPipeBlock(x,y)
{
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -gameSpeed;
}
function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeights();
    } else {
        generatepipe();
    }
}
/*
*This function updates the scene. It is called for every new frame.
*/
function update() {
    for(var index=0; index<pipes.length; index++) {
        game.physics.arcade
            .overlap(player1,
            pipes[index],
            gameOver);
    }
    for(var index=0; index<pipes.length; index++) {
        game.physics.arcade
            .overlap(player2,
            pipes[index],player2.
            gameOver);
    }
    if(player1.body.y < 0 || player1.body.y > 400){
        gameOver();
    }

    if(player2.body.y < 0 || player2.body.y > 400){
        gameOver();
    }
    player1.rotation = Math.atan(player1.body.velocity.y / gameSpeed);
    player2.rotation = Math.atan(player2.body.velocity.y / gameSpeed);


    checkBonus(balloons, -100);
    checkBonus(weights, 100);


}
function changeGravity(g,p){
    gameGravity+=g;
    p.body.gravity.y += g;
}
function generateBalloons(){
    var bonus = game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - gameSpeed;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}
function generateWeights(){
    var bonus =game.add.sprite(width,0, "weights");
    weights.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x=-gameSpeed;
    bonus.body.velocity.y=game.rnd.integerInRange(60,25);
}

function checkBonus(bonusArray, bonusEffect){
        for(var i=bonusArray.length - 1; i>=0; i--){
            game.physics.arcade.overlap(player1,bonusArray[i], function(){
                changeGravity(bonusEffect,player1);
                bonusArray[i].destroy();
                bonusArray.splice(i,1);
            });
        }
    for(var i=bonusArray.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player2,bonusArray[i], function(){
            changeGravity(bonusEffect,player2);
            bonusArray[i].destroy();
            bonusArray.splice(i,1);
        });
    }
}

function gameOver() {

    game.destroy();
    //  game.state.restart();
    // if (game.paused(true)){
    //   $("#greeting").show();
    // $("#score").val(score);
    //game.state.restart();
//}
   // if (game.paused(false)){
     //   $("#greeting").hide();
  //  }
   // game.state.restart()
    $("#score").val(score);
    $("#greeting").show();
    gameGravity=200
}
$.get("/score", function(data){
    var scores = JSON.parse(data);
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append("<li>" + scores[i].name + ": " +
        scores[i].score + "</li>");
    }
});

function changeScore(){
    score=score +1;
labelScore.setText(score.toString());
}