//BOARD
let board;
let boardWidth = 360;
let boardHeight = 600;
let context;

//BIRD
let birdWidth = 34;
let birdHeight = 24;
let birdXPos = boardWidth / 8;
let birdYPos = boardHeight / 2;
let birdImg;
let bird = {
    x: birdXPos,
    y: birdYPos,
    width: birdWidth,
    height: birdHeight
};


//PIPES
let pipeArr = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeXPos = boardWidth;
let pipeYPos = 0;
let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;  //pipes moving left speed
let velocityY = 0;  //bird jump speed
let gravity = 0.2;  //makes bird go down

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext('2d');

    //load bird img
    birdImg = new Image();
    birdImg.src = './assets/flappybird.png';
    birdImg.onload = () => context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // load pipes img
    topPipeImg = new Image()
    topPipeImg.src = './assets/toppipe.png';

    bottomPipeImg = new Image()
    bottomPipeImg.src = './assets/bottompipe.png';


    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener('keydown', moveBird);
};

function update(){
    requestAnimationFrame(update);
    if(gameOver) return;


    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit to bird.y = 0(top of canvas)
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //check for hitting the ground
    if(bird.y > board.height) gameOver = true;

    //pipes
    for (let i = 0; i < pipeArr.length; i++) {
        let pipe = pipeArr[i];
        pipe.x += velocityX 
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 5;
            pipe.passed = true;
        }

        if(detectCollisions(bird, pipe)) gameOver = true;
    };

    //clear pipes
    while(pipeArr.length > 0 && pipeArr[0].x < -pipeWidth){
        console.log(pipeArr);
        pipeArr.shift(); //removes the first pipe from the array after it is off screan
    }

    //score
    context.fillStyle = 'white';
    context.font = '45px sans-serif';
    context.fillText(`Socre: ${score}`, 5, 45)

    //Show game over Text
    if(gameOver){
        context.fillText(`Game Over`, 60, 200)
    }
};

function placePipes(){
    if(gameOver) return;

    let randomPipeY = pipeYPos - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeXPos,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeXPos,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    pipeArr.push(topPipe);
    pipeArr.push(bottomPipe);
};

function moveBird(e){
    if(e.code == 'Space' || e.code == 'ArrowUp'|| e.code == 'KeyX'){
        //jump
        velocityY = -6;

        //reset game
        if(gameOver){
            bird.y = birdYPos;
            pipeArr = [];
            score = 0;
            gameOver = false;
        }
    }
};

function detectCollisions(a, b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
}