
// basics environment setup
const canvas = document.createElement('canvas');

document.querySelector(".myGame").appendChild(canvas);

canvas.width = innerWidth;
canvas.height = innerHeight;

// we have to make 2D animation 
const context = canvas.getContext("2d");

let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");

// basics functions

// EventListener for difficulty
document.querySelector("input").addEventListener("click", (e) => {
    e.preventDefault();

    // making form invisible
    form.style.display = "none";
    // making scoreBoard visible
    scoreBoard.style.display = "block";
    // getting difficulty selected user
    const userValue = document.getElementById("difficulty").value;
    // alert(userValue);
    if(userValue === 'Easy'){
        setInterval(spawnEnemy, 2000);
        return difficulty = 5;
    }

    if(userValue === 'Medium'){
        setInterval(spawnEnemy, 1500)
        return difficulty = 8;
    }

    if(userValue === 'Hard'){
        setInterval(spawnEnemy, 1100)
        return difficulty = 10;
    }

    if(userValue === 'Insane'){
        setInterval(spawnEnemy, 800)
        return difficulty = 12;
    }

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



// ------------------ Main Code Start Here ---------------------


const a = new Player(playerPosition.x, 
    playerPosition.y, 
    15, 
   "whitesmoke");

const weapons = []
const enemies = []

//  function to create spawnEnemy at random location
const spawnEnemy = () => {

    // generating random size of enemy
    const enemySize = Math.random() * ( 40 - 5 ) + 5;
    const enemyColor =  `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`

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
        x:Math.cos(myAngle) * difficulty,
        y:Math.sin(myAngle) * difficulty, 
        
    }; 

    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity))
}


// ----------- creating animation function ---------

let animationId

function animation(){
    animationId = requestAnimationFrame(animation);

    context.fillStyle = "rgba(0,0,0,0.2)"
    context.fillRect(0, 0, canvas.width, canvas.height);
    // context.clearRect
    // console.log(Math.random())
    a.draw();
    
    // generating Bullets
    weapons.forEach((weapon, weaponIndex) => {
        // weapon.draw();
        weapon.update();
        if(
            weapon.x + weapon.radius < 1 || 
            weapon.y + weapon.radius < 1 || 
            weapon.x - weapon.radius > canvas.width ||
            weapon.y - weapon.radius > canvas.height
        )   {
            weapons.splice(weaponIndex, 1)
        }
    });
    //  generating enemies
    enemies.forEach((enemy, enemyIndex) => {
        
       
        
        enemy.update();
        const distanceBetweenPlayerAndEnemy  =  Math.hypot(
            a.x - enemy.x,
            a.y - enemy.y)

            if(distanceBetweenPlayerAndEnemy - a.radius - enemy.radius < 1){
                cancelAnimationFrame(animationId)
                // console.log("Game Over..!")
            }

        weapons.forEach((weapon, weaponIndex) =>{
            const distanceBetweenWeaponAndEnemy = Math.hypot(
                weapon.x - enemy.x,
                weapon.y - enemy.y)

                if(distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1){
                    // console.log("Killed")
                   
                    if(enemy.radius > 15){
                      gsap.to(enemy, {
                          radius: enemy.radius - 10,
                      })
                        // enemy.radius -= 5;
                        setTimeout( () => {
                            // enemies.splice(enemyIndex, 1); 
                           
                            weapons.splice(weaponIndex, 1);
                           }, 0)
                    } else{
                        setTimeout( () => {
                            enemies.splice(enemyIndex, 1); 
                           
                            weapons.splice(weaponIndex, 1);
                           }, 0)
                    }
                }
        })
    });
}
// console.log(gsap)
// setInterval(spawnEnemy, 1000)


//  ------------- Adding eventListener --------------------------------
 
canvas.addEventListener("click", (e) => {
    
    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2, 
        e.clientX - canvas.width / 2
        );

    const velocity = {
        y:Math.sin(myAngle) * 6, 
        x:Math.cos(myAngle) * 6
    };
//    console.log(myAngle);

    weapons.push( new Weapon(canvas.width / 2, canvas.height / 2, 6,"white", velocity)
    );
});

animation()