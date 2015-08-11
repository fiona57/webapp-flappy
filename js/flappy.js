// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score=0;
score=0;
var labelScore;
var player1;
var player2;
var pipes = [];

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
    player1.scale.x = 0.2;
    player1.scale.y = 0.2;
    player1.x=10;
    player1.y=20;

    player2 = game.add.sprite(10,200, "player2Img");
    player2.scale.x = 0.2;
    player2.scale.y = 0.2;
    player2.x=10;
    player2.y=300;
   // game.input
      //  .onDown
      //  .add(clickHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.NUMPAD_0)
        .onDown.add(spaceHandler);
    //alert(score);
labelScore = game.add.text(700,20, "0");

    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(move1Right);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(move1Left);
    game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(move1Up);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(move1Down);

    game.input.keyboard.addKey(Phaser.Keyboard.N).onDown.add(move2Right);
    game.input.keyboard.addKey(Phaser.Keyboard.V).onDown.add(move2Left);
    game.input.keyboard.addKey(Phaser.Keyboard.H).onDown.add(move2Up);
    game.input.keyboard.addKey(Phaser.Keyboard.B).onDown.add(move2Down);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player1);
    game.physics.arcade.enable(player2);
    player1.body.velocity.x = 150;
    player2.body.velocity.x = 150;
    player1.body.gravity.y = 20;
    player2.body.gravity.y = 20;

    game.input.keyboard
        .addKey(Phaser.Keyboard.NUMPAD_0)
            .onDown.add(player1jump);
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(player2jump);



    pipeInterval = 1.5;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generatepipe);

    generatepipe();
}

function clickHandler(event)
{
    alert(game.add.sprite(event.x,event.y, "playerImg"));
}
function spaceHandler()
    {
        game.sound.play("score");
    }
function move1Right ()
{
    player1.x+=10;
}
function move1Left ()
{
    player1.x-=10;
}
function move1Up ()
{
    player1.y-=30;
}
function move1Down ()
{
    player1.y+=30;
}
function move2Right ()
{
    player2.x+=10;
}
function move2Left ()
{
    player2.x-=10;
}
function move2Up ()
{
    player2.y-=30;
}
function move2Down ()
{
    player2.y+=30;
}

function player1jump()
{
    player1.body.velocity.y = -20;
}
function player2jump()
{
 player2.body.velocity.y = -20;
}

function generatepipe()
{
var gap = game.rnd.integerInRange(1,5);
    for(var count=0; count<8; count=count+1) {
   if (count != gap && count !=gap + 1){
    addPipeBlock(750, count*50);
   }
    }
    changeScore();
}

function addPipeBlock(x,y)
{
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
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
            pipes[index],
            gameOver);
    }
}

function gameOver()
{
    location.reload();
}

function changeScore(){
    score=score +1;
labelScore.setText(score.toString());
}