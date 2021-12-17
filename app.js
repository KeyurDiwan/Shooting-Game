const canvas = document.createElement('canvas');

document.querySelector(".myGame").appendChild(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;

// we have to make 2D animation 
const context = canvas.getContext("2d");

let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");

document.querySelector("input").addEventListener("click", (e) => {
    e.preventDefault();

    form.style.display = "none";
    scoreBoard.style.display = "block";

    const userValue = document.getElementById("difficulty").value;
    alert(userValue);

})

// ------------------

playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2,
}

// create a class 
class Player{
    constructor(x,y,radius, color) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

    }
    draw() {
    context.beginPath();    
    context.arc(
        this.x,
        this.y, 
        this.radius, 
        Math.PI / 180 * 0, 
        Math.PI / 180 * 360, 
        false
        );

    context.fillStyle = this.color;     
    context.fill();
    }
  
}

// -------- make a weapon---------
class Weapon{
    constructor(x,y,radius, color, velocity) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }
    draw() {
    context.beginPath();    
    context.arc(
        this.x,
        this.y, 
        this.radius, 
        Math.PI / 180 * 0, 
        Math.PI / 180 * 360, 
        false
        );

    context.fillStyle = this.color;     
    context.fill();
    }

    update(){
        this.draw();
        this.x += this.velocity.x,
        this.y += this.velocity.y 
    }
  
}

// ------make enemy-------

class Enemy{
    constructor(x,y,radius, color, velocity) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }
    draw() {
    context.beginPath();    
    context.arc(
        this.x,
        this.y, 
        this.radius, 
        Math.PI / 180 * 0, 
        Math.PI / 180 * 360, 
        false
        );

    context.fillStyle = this.color;     
    context.fill();
    }

    update(){
        this.draw();
        this.x += this.velocity.x,
        this.y += this.velocity.y 
    }
  
}



// ------------------
const a = new Player(playerPosition.x, 
    playerPosition.y, 
    15, 
    `rgb(${Math.random() * 250},${Math.random() * 250},${Math.random() * 250})`);

const weapons = []
const enemies = []

const spawnEnemy = () => {

    const enemySize = Math.random() * ( 40 - 5 ) + 5;
    const enemyColor =  `rgb(${Math.random() * 250},${Math.random() * 250},${Math.random() * 250})`

    let random;

    // this condition check enemy position 
    if(Math.random() < 0.5){
        random = {
            x:Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
            y:Math.random() * canvas.height
        };
    } else {
        random = {
            x:Math.random() * canvas.width,
            y:Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize
            
        };
    }

    const myAngle = Math.atan2(
       canvas.height / 2 - random.y, 
       canvas.width / 2 - random.x
        );

    const velocity = {
        x:Math.cos(myAngle) * 5,
        y:Math.sin(myAngle) * 5, 
        
    }; 

    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity))
}

function animation(){
    requestAnimationFrame(animation);

    context.clearRect(0, 0, canvas.width, canvas.height);
    // console.log(Math.random())
    a.draw();
    
    weapons.forEach((weapon) => {
        // weapon.draw();
        weapon.update();
    });

    enemies.forEach((enemy) => {
        enemy.update();
    });
}

// setInterval(spawnEnemy, 1000)

canvas.addEventListener("click", (e) => {
    
    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2, 
        e.clientX - canvas.width / 2
        );

    const velocity = {
        y:Math.sin(myAngle) * 10, 
        x:Math.cos(myAngle) * 10
    };
//    console.log(myAngle);

    weapons.push( new Weapon(canvas.width / 2, canvas.height / 2, 6,"white", velocity)
    );
});

animation()