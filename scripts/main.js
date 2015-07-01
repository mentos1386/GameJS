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
        var color = 'red';
        var alive = true;

        if(i== 10*rowCount){
            rowCount = rowCount +1;
        }

        if(i == 0 || i == rowCount * 10 - 10){
            var x = 10;
            var y = 1 * rowCount * (blocks.height + 20);
        }
        else if(i < 10*rowCount){
            var x = blocks[i-1].x+blocks.width+10;
            var y = 1 * rowCount * (blocks.height + 20);
        }
        blocks.push(new Block(x,y, color, alive))
    }
}

// -------------------------------------
// Border restrictions:

function wallBorder(){
    // Left
    if(ball.x <= 0){
        ball.dx = -ball.dx;
    }
    // Right
    if(ball.x >= ctx.canvas.width){
        ball.dx = -ball.dx;
    }
    // Top
    if(ball.y <= 0){
        ball.dy = -ball.dy;
    }
    // Bottom
    if(ball.y >= ctx.canvas.height){
        ball.dy = -ball.dy;

    }

}

function blocksBorder(){
    var ballX = ball.x ;
    var ballY = ball.y;

    for(var i = 0; i < blocks.count; i++){

        // Bottom
        if((ball.x >= blocks[i].x && ball.x <= blocks[i].x+blocks.width) && (ball.y-20 == blocks[i].y+blocks.height)){
            ball.dy = -ball.dy;
        }
    }
}

function padBorder(){

    var ballX = ball.x  ;
    var ballY = ball.y + 10;

    // Hit Pad TOP
    if((ballX >= pad.x && ballX <= pad.x+pad.width) && (ballY == pad.y)){
        ball.dy = -ball.dy;
    }
    // Hit Pad TOP-LEFT
    if((ballX >= pad.x && ballX <= pad.x+pad.width/10) && (ballY == pad.y)){
        ball.dx = -10;
    }
    // Hit Pad TOP-RIGHT
    if((ballX >= pad.x+pad.width-pad.width/10 && ballX <= pad.x+pad.width) && (ballY == pad.y)){
        ball.dx = 10;
    }

}

// -------------------------------------
// Draw functions:

function clear(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawBlock(ctx, x, y, color, alive){
    if(alive){
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blocks.width, blocks.height);
    }
}

function drawPad(ctx, x, y){
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, pad.width, pad.height);
}

function drawBall(ctx, x, y){
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI*2, true)
    ctx.closePath();
    ctx.fill();
}

function drawScene(){
    clear();

    // Display Blocks
    for(var i = 0; i < blocks.length; i++){
        drawBlock(ctx, blocks[i].x, blocks[i].y, blocks[i].color, blocks[i].alive);
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

// -------------------------------------
// Initialization

$(function(){
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');

    ctx.canvas.width  = 1200;
    ctx.canvas.height = 700;

    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    // Blocks sizing and positioning
    blocks.count = 30 // Default 40
    blocks.width = (((width-10)/10)-10);
    blocks.height = 50;

    createBlocks(blocks.count);

    // Pad sizing and positioning
    pad.width = 200;
    pad.height = 25;
    pad.x = (width/2)-100;
    pad.y = height-50;

    // Pad moving
    $(document).keydown(function(e) {
        switch (e.which) {

            // Left
            case 37:
                pad.x = pad.x - 20;
                break;
            // Right
            case 39:
                pad.x = pad.x + 20;
                break;
            // Pause
            case 27:
                break;
        }
    });

    // Ball positioning
    ball.x = width/2;
    ball.y = height-100;

    // Directional movement
    ball.dx = 0;
    ball.dy = -10;

    setInterval(drawScene, 30); // loop drawScene 30 Default
});