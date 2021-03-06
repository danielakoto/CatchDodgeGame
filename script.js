
//Start Game
const st = document.getElementById('StartButton');
const splash = document.getElementById('SplashScreen');
const canvas = document.getElementById('canvas1');
const endgame = document.getElementById('endgame');
const canvas1 = document.getElementById('canvasback');
const showHighScore = document.getElementById('showHighscore');
const finscore = document.getElementById('finscore');
const hid = document.getElementById('highestnumber');
const dodge = document.getElementById('dodge');
const statement = document.getElementById('statement');

st.addEventListener('click', startGame);
endgame.addEventListener('click', gameOver);

//Canvas 
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let enemySpeed = 1;
let score = 0;
let level = 1;
let templevel = 0;
let gameFrame = 0;
ctx.font = '50px Comic Sans MS';

//Player 
const playerRight = new Image();
const playerLeft = new Image();

//Mouse Interact
let canvasPosition = canvas.getBoundingClientRect();


const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(e){
    mouse.click = true;
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});

canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
    mouse.click = false;
});

canvas.addEventListener('mouseup', function(){
    mouse.click = false;
});


window.onresize = function(){
    location.reload();
}

//Random Number Go Getter
var que =  Math.floor((Math.random()*10));

//Sounds
const bubblePop1 = document.createElement('audio'); //bubble pop 1
bubblePop1.src = 'public/sounds/bubbles-single1.wav';
bubblePop1.volume = 0.6;

const enemybubblePop1 = document.createElement('audio'); //enemy ballon pop 1
enemybubblePop1.src = 'public/sounds/BalloonPop1.wav';
enemybubblePop1.volume = 0.5;


//Load Sounds
bubblePop1.load();
enemybubblePop1.load();

//Player 

playerLeft.src = 'public/img/black-circle.png';
playerRight.src = 'public/img/black-circle.png';
var gameSwitch = true;

class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 40;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta
        if(mouse.x != this.x){
            this.x -= dx/1.1;
        }
        if(mouse.y != this.y){
            this.y -= dy/1.1;
        }
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0 , Math.PI * 2);
        ctx.closePath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if(this.x >= mouse.x){
            ctx.drawImage(playerLeft, 0-45, 0-45, this.spriteWidth/4-40, this.spriteHeight/4)
        }
        else {
            ctx.drawImage(playerRight, 0-45, 0-45, this.spriteWidth/4-40, this.spriteHeight/4)
        }
        ctx.restore();
    }
}
const player = new Player();

const theimg = document.createElement('img');
theimg.src = 'public/img/black.png';


const enemyimg = document.createElement('img');
enemyimg.src = 'public/img/w.png';

//Bubbles
const bubblesArray = [];
class Bubble {

    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 38;
        this.speed = Math.random() * 5 + (level/2);
        this.distance;
        this.counted = false;
        this.sound = 'sound1';
        this.spriteWidth = 498;
        this.spriteHeight = 327;
        this.e = Math.floor((Math.random()*10));
    }

    update(){

        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.drawImage(theimg, this.x-25, this.y-45, this.spriteWidth/4-40, this.spriteHeight/4+5)
        ctx.closePath();
        ctx.restore();
    }
}

//Enemy Bubbles
const enemybubblesArray = [];
class EnemyBubble {

    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 38;
        this.speed = Math.random() * 2 + level/2;
        this.distance;
        this.counted = false;
        this.sound = 'sound1';
        this.spriteWidth = 498;
        this.spriteHeight = 327;
        this.e = Math.floor((Math.random()*10));
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.drawImage(enemyimg, this.x-25, this.y-45, this.spriteWidth/4-40, this.spriteHeight/4+5);
        ctx.closePath();
        ctx.restore();
    }
}

function handleBubbles(){

    if (gameFrame % (100) == 0){
        playerLeft.src = 'public/img/black-circle.png';
        playerRight.src = 'public/img/black-circle.png';
        bubblesArray.push(new Bubble());
    }
    for(let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update(Player);
        bubblesArray[i].draw();

    }
    for(let i = 0; i < bubblesArray.length; i++){
        if(bubblesArray[i].x < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i, 1);
        }
        if(bubblesArray[i]){
            if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
                if(!bubblesArray[i].counted){
                    if(bubblesArray[i].sound == 'sound1') {
                        bubblePop1.play();
                    } else {
                        bubblePop2.play();
                    }
                    playerLeft.src = 'public/img/black-circle.png';
                    playerRight.src = 'public/img/black-circle.png';
                    score++;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i, 1);
                    if(score % 5 == 0) {
                        level++;
                        templevel++;
                        enemySpeed += level;
                    }
                }
            }
        }
    }
}

function enemyhandleBubbles() {
    let numframe = 125-(5*level);
    if (gameFrame % (numframe) == 0){
        playerLeft.src = 'public/img/black-circle.png';
        playerRight.src = 'public/img/black-circle.png';
        enemybubblesArray.push(new EnemyBubble());
    }
    for(let j = 0; j < enemybubblesArray.length; j++){
        enemybubblesArray[j].update(Player)
        enemybubblesArray[j].draw();
        
    }
    for(let j = 0; j < enemybubblesArray.length; j++){
        if(enemybubblesArray[j].x < 0 - enemybubblesArray[j].radius * 2){
            enemybubblesArray.splice(j, 1);
        }

        if(enemybubblesArray[j]){
            if(enemybubblesArray[j].distance < enemybubblesArray[j].radius + player.radius){
                if(!enemybubblesArray[j].counted){
                    if(enemybubblesArray[j].sound == 'sound1')
                        enemybubblePop1.play();
                    playerLeft.src = 'public/img/black-circle.png';
                    playerRight.src = 'public/img/black-circle.png';
                    enemybubblesArray[j].counted = true;
                    enemybubblesArray.splice(j, 1);
                    gameOver();
                }
            }
        }
    }
}


//Animations 
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    enemyhandleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.font = '18px';
    ctx.fillText('Score: ' + score, 7, 50);
    gameFrame++;
    requestAnimationFrame(animate);
    
}

//Settle High Score
async function getX() {
    let b = [];
    var ref = db.collection("highscore").orderBy("highnum", "desc").limit(1);
    await ref.get().then(snapshot => {
            b = snapshot.docs.map(doc => doc.data().highnum);
    })
    return parseInt(b);
}

function getHighScore(hid) { 
    var ref = db.collection("highscore").orderBy("highnum", "desc").limit(1);
    ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
            hid.innerHTML = "Highest Score = " + doc.data().highnum;
        })
    })
}
getHighScore(hid);

function startGame(){
    splash.style.display = 'none';
    endgame.style.display = 'inline-block';
    animate();
}

async function gameOver() {
    
    
    bubblePop1.volume = 0;
    enemybubblePop1.volume = 0;
    st.style.display = 'none';
    dodge.innerHTML = "Game Over";
    statement.innerHTML = 'reloading...'
    endgame.style.display = 'none';
    endgame.hidden = 'true'
    splash.style.display = 'inline-block';
    canvas1.style.zIndex = '2';
    splash.style.zIndex = '3';

    var currentScore = score;
    finscore.innerHTML = 'Your Score: ' + currentScore;
    
    const x = await getX();
    
    //Update database if current highscore is greater than score in database
    const { serverTimestamp } = firebase.firestore.FieldValue;
    if (currentScore > x) {
        const h = currentScore;
        db.collection('highscore').doc('1').update({
            highnum: h,
            time: serverTimestamp(),
        });
    }

    window.setTimeout(function(){location.reload()},1500);
    
}
//Background
const colors = ["#FFFFFF", "#FFFFFF", "#000", "#FFFFFF", "#000"];

const numBalls = 50;
const balls = [];

for (let i = 0; i < numBalls; i++) {
  let ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
  ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
  ball.style.transform = `scale(${Math.random()})`;
  ball.style.width = `${Math.random()}em`;
  ball.style.height = ball.style.width;
  
  balls.push(ball);
  document.body.append(ball);
}

// Keyframes
balls.forEach((el, i, ra) => {
  let to = {
    x: Math.random() * (i % 2 === 0 ? -11 : 11),
    y: Math.random() * 12
  };

  let anim = el.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: `translate(${to.x}rem, ${to.y}rem)` }
    ],
    {
      duration: (Math.random() + 1) * 2000, // random duration
      direction: "alternate",
      fill: "both",
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
});

