var canvas,
    ctx;
var pad = []
var blocks = [];
var ball = [];


//DEBUG

function debug(){
    $('.ball-coordinates').html('ball x= '+ball.x+'; ball y= '+ball.y+';');
    $('.ball-direction').html('ball dx= '+ball.dx+'; ball dy= '+ball.dy+';');
    $('.pad-coordinates').html('pad x= '+pad.x+' - '+(pad.x+pad.width)+'; pad y= '+pad.y+' - '+(pad.y+pad.height)+';');
    $('.blocks').html('Blocks Left = '+(blocks.count-blocks.dead));

}

//DEBUG

// -------------------------------------
// Objects:

function Block(x, y, color, alive){
    this.x = x;
    this.y = y;
    this.color = color;
    this.alive = alive;
}

// -------------------------------------
// Create Blocks

function createBlocks(count){
    var rowCount = 1;
    for(var i = 0; i < count; i++){
        var color = 'orange';
        var alive = true;

        if(i== 10*rowCount){
            rowCount = rowCount +1;
        }

        var y = rowCount * (blocks.height + 20);

        if(i == 0 || i == rowCount * 10 - 10){
            var x = 10;
        }
        else if(i < 10*rowCount){
            var x = blocks[i-1].x+blocks.width+10;
        }
        blocks.push(new Block(x,y, color, alive))
    }
}

// -------------------------------------
// Border restrictions:

function wallBorder(){
    // Left
    if(ball.x-20 <= 0){
        ball.dx = -ball.dx;
    }
    // Right
    if(ball.x+20 >= ctx.canvas.width){
        ball.dx = -ball.dx;
    }
    // Top
    if(ball.y-20 <= 0){
        ball.dy = -ball.dy;
    }
    // Bottom, you lose
    if(ball.y+20 >= ctx.canvas.height){
        ctx.game = 'lost';
    }

}

function blocksBorder(){
    var blocksHited = 0;
    for(var i = 0; i < blocks.count; i++){
        if(blocks[i].alive){
            // Did we hit block?

            // Bottom
            if((ball.y == blocks[i].y+blocks.height) && ((ball.x-20 >= blocks[i].x && ball.x-20 <= blocks[i].x+blocks.width) || (ball.x+20 >= blocks[i].x && ball.x+20 <= blocks[i].x+blocks.width))){
                if(blocksHited == 0){
                    // Ball bounces off
                    ball.dy = -ball.dy;
                }
                // Mark block as destroyed
                blocks[i].alive = false;
                blocksHited++;
            }
            // Top
            if((ball.y == blocks[i].y) && ((ball.x-20 >= blocks[i].x && ball.x-20 <= blocks[i].x+blocks.width) || (ball.x+20 >= blocks[i].x && ball.x+20 <= blocks[i].x+blocks.width))){
                if(blocksHited == 0){
                    // Ball bounces off
                    ball.dy = -ball.dy;
                }
                // Mark block as destroyed
                blocks[i].alive = false;
                blocksHited++;
            }
            // Left
            if(((ball.y-20 >= blocks[i].y && ball.y-20 <= blocks[i].y+blocks.height || (ball.y+20 >= blocks[i].y && ball.y+20 <= blocks[i].y+blocks.height)) && (ball.x == blocks[i].x))){
                if(blocksHited == 0){
                    // Ball bounces off
                    ball.dx = -ball.dx;
                }
                // Mark block as destroyed
                blocks[i].alive = false;
                blocksHited++;
            }
            // Right
            if(((ball.y-20 >= blocks[i].y && ball.y-20 <= blocks[i].y+blocks.height || (ball.y+20 >= blocks[i].y && ball.y+20 <= blocks[i].y+blocks.height)) && (ball.x == blocks[i].x+blocks.width))){
                if(blocksHited == 0){
                    // Ball bounces off
                    ball.dx = -ball.dx;
                }
                // Mark block as destroyed
                blocks[i].alive = false;
                blocksHited++;
            }
        }
    }
}

function padBorder(){
    // Hit Pad TOP-LEFT
    if((ball.x >= pad.x && ball.x <= pad.x+pad.width/10 ) && (ball.y+20 == pad.y)){
        ball.dx = -10;
        ball.dy = -ball.dy;
    }
    // Hit Pad TOP-RIGHT
    else if((ball.x >= pad.x+pad.width-pad.width/10 && ball.x <= pad.x+pad.width) && (ball.y+20 == pad.y)){
        ball.dx = 10;
        ball.dy = -ball.dy;
    }
    // Hit Pad TOP
    else if((ball.x-20 >= pad.x && ball.x-20 <= pad.x+pad.width || ball.x+20 >= pad.x && ball.x+20 <= pad.x+pad.width) && (ball.y+20 == pad.y)){
        ball.dy = -ball.dy;
    }
}

// -------------------------------------
// Draw functions:

function clear(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawBlock(ctx, x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blocks.width, blocks.height);
}

function drawPad(ctx, x, y){
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, pad.width, pad.height);
}

function drawBall(ctx, x, y){
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

function drawLost(){
    ctx.font = '50px serif';
    ctx.fillStyle = 'orange';
    ctx.textAlign = 'center';
    ctx.fillText('You lost :(', canvas.width/2, 250);
    ctx.font = '20px serif';
    ctx.fillText('Press ENTER to restart.', canvas.width/2, 450);
}

function drawWon(){
    ctx.font = '50px serif';
    ctx.fillStyle = 'orange';
    ctx.textAlign = 'center';
    ctx.fillText('You Won :)', canvas.width/2, 250);
    ctx.font = '20px serif';
    ctx.fillText('Press ENTER to restart.', canvas.width/2, 450);
}

function drawScene(){

    clear();

    if(ctx.game == 'play'){
        // Display Blocks
        for(var i = 0; i < blocks.length; i++){
            if(blocks[i].alive){
                drawBlock(ctx, blocks[i].x, blocks[i].y, blocks[i].color);
            }
        }
        // Check how many blocks are destroyed
        blocks.dead = 0;
        for(var i = 0; i < blocks.length; i++){
            if(!blocks[i].alive){
                blocks.dead ++;
            }
        }
        // If all blocks are destroyed end game (Win)
        if(blocks.dead == blocks.length){
            ctx.game = 'won';
        }

        // Display Pad
        drawPad(ctx, pad.x, pad.y);

        // Display Ball
        drawBall(ctx, ball.x, ball.y);

        // Move Ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Restrict Ball
        wallBorder();
        padBorder();
        blocksBorder();

        debug();
    }
    else if(ctx.game == 'lost'){
        drawLost();
    }
    else if(ctx.game == 'won'){
        drawWon();
    }
}

// -------------------------------------
// Initialization

function resetGame(){

    // Remove blocks
    blocks.splice([])

    // Create new blocks
    createBlocks(blocks.count);

    // Pad sizing and positioning
    pad.width = 200;
    pad.height = 25;
    pad.x = (ctx.canvas.width/2)-100;
    pad.y = ctx.canvas.height-50;

    // Ball positioning
    ball.x = ctx.canvas.width/2;
    ball.y = ctx.canvas.height-100;

    // Directional movement
    ball.dx = 0;
    ball.dy = -10;
}

$(function(){
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');

    ctx.canvas.width  = 1200;
    ctx.canvas.height = 700;

    // Blocks sizing and positioning
    blocks.count = 30; // Default 30
    blocks.width = (((ctx.canvas.width-10)/10)-10);
    blocks.height = 50;

    // Pad moving
    $(document).keydown(function(e) {
        switch (e.which) {

            // Left
            case 37:
                // Check if we hit left corner
                if(pad.x > 0){
                    pad.x = pad.x - 20;
                }
                break;
            // Right
            case 39:
                // Check if we hit right corner
                if(pad.x+pad.width < ctx.canvas.width){
                    pad.x = pad.x + 20;
                }
                break;
            // Enter
            case 13:
                if(ctx.game == 'lost' || ctx.game == 'won'){
                    ctx.game = 'play';
                    resetGame();
                }
                break;
        }
    });

    resetGame();

    ctx.game = 'play';

    setInterval(drawScene, 30); // loop drawScene //30 Default
});