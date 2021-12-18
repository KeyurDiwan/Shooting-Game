// basics environment setup
const canvas = document.createElement("canvas");
const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;
const LargeWeaponDamage = 50;
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
  if (userValue === "Easy") {
    setInterval(spawnEnemy, 2000);
    return (difficulty = 5);
  }

  if (userValue === "Medium") {
    setInterval(spawnEnemy, 1500);
    return (difficulty = 8);
  }

  if (userValue === "Hard") {
    setInterval(spawnEnemy, 1100);
    return (difficulty = 10);
  }

  if (userValue === "Insane") {
    setInterval(spawnEnemy, 800);
    return (difficulty = 12);
  }
});

// ------------------

playerPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

// create a class
class Player {
  constructor(x, y, radius, color) {
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
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );

    context.fillStyle = this.color;
    context.fill();
  }
}

// -------- make a weapon---------
class Weapon {
  constructor(x, y, radius, color, velocity, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
  }
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );

    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// -------- make a very large  weapon---------
class LargeWeapon {
  constructor(x, y, damage) {
    this.x = x;
    this.y = y;

    this.color = "red";

    this.damage = damage;
  }
  draw() {
    context.beginPath();

    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 150, canvas.height);
    // context.fill();
  }

  update() {
    this.draw();
    this.x += 10;
    // this.y += 10;
  }
}

// ------make enemy-------

class Enemy {
  constructor(x, y, radius, color, velocity) {
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
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );

    context.fillStyle = this.color;
    context.fill();
  }

  update() {
    this.draw();
    (this.x += this.velocity.x), (this.y += this.velocity.y);
  }
}

// ----------------create partical class-------------

const fraction = 0.99;
class Partical {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    context.save();
    context.globalAlpha = this.alpha;

    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );

    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= fraction;
    this.velocity.y *= fraction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

// ------------------ Main Code Start Here ---------------------

const a = new Player(playerPosition.x, playerPosition.y, 15, "whitesmoke");

const weapons = [];
const enemies = [];
const particles = [];
const largeWeapons = [];

//  function to create spawnEnemy at random location
const spawnEnemy = () => {
  // generating random size of enemy
  const enemySize = Math.random() * (40 - 5) + 5;
  const enemyColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;

  let random;

  // this condition check enemy position
  if (Math.random() < 0.5) {
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
      y: Math.random() * canvas.height,
    };
  } else {
    random = {
      x: Math.random() * canvas.width,
      y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
    };
  }

  const myAngle = Math.atan2(
    canvas.height / 2 - random.y,
    canvas.width / 2 - random.x
  );

  const velocity = {
    x: Math.cos(myAngle) * difficulty,
    y: Math.sin(myAngle) * difficulty,
  };

  enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};

// ----------- creating animation function ---------

let animationId;

function animation() {
  animationId = requestAnimationFrame(animation);

  context.fillStyle = "rgba(0,0,0,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // context.clearRect
  // console.log(Math.random())
  a.draw();

  // generating particles

  particles.forEach((partical, particalIndex) => {
    if (partical.alpha <= 0) {
      particles.splice(particalIndex, 1);
    } else {
      partical.update();
    }
  });

  // generting largeWeapon

  largeWeapons.forEach((largeWeapon, largeWeaponIndex) => {
    if (largeWeapon.x > canvas.width) {
      largeWeapons.splice(largeWeaponIndex, 1);
    } else {
      largeWeapon.update();
    }
  });
  // generating Bullets
  weapons.forEach((weapon, weaponIndex) => {
    // weapon.draw();
    weapon.update();
    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });
  //  generating enemies
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    const distanceBetweenPlayerAndEnemy = Math.hypot(
      a.x - enemy.x,
      a.y - enemy.y
    );

    if (distanceBetweenPlayerAndEnemy - a.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
      // console.log("Game Over..!")
    }
    //

    largeWeapons.forEach((largeWeapon) => {
      // find the distance largeWeapon and enemy

      const distanceBetweenLargeWeaponAndEnemy = largeWeapon.x - enemy.x;

      if (
        distanceBetweenLargeWeaponAndEnemy <= 200 &&
        distanceBetweenLargeWeaponAndEnemy >= -200
      ) {
        setTimeout(() => {
          enemies.splice(enemyIndex, 1);

          // weapons.splice(weaponIndex, 1);
        }, 0);

        enemies.splice(enemyIndex, 1);
      }
    });
    weapons.forEach((weapon, weaponIndex) => {
      //    finding the distance between weapon and enemy
      const distanceBetweenWeaponAndEnemy = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );

      if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {
        // console.log("Killed")

        // reducing the size of enemy
        if (enemy.radius > weapon.damage + 6) {
          gsap.to(enemy, {
            radius: enemy.radius - weapon.damage,
          });
          // enemy.radius -= 5;
          setTimeout(() => {
            // enemies.splice(enemyIndex, 1);

            weapons.splice(weaponIndex, 1);
          }, 0);
        }
        // removing enemy
        else {
          for (let i = 0; i < enemy.radius * 3; i++) {
            particles.push(
              new Partical(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              })
            );
          }

          setTimeout(() => {
            enemies.splice(enemyIndex, 1);

            weapons.splice(weaponIndex, 1);
          }, 0);
        }
      }
    });
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
    y: Math.sin(myAngle) * 6,
    x: Math.cos(myAngle) * 6,
  };
  //    console.log(myAngle);

  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      6,
      "white",
      velocity,
      lightWeaponDamage
    )
  );
});

// --------------event listener for right click
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );

  const velocity = {
    y: Math.sin(myAngle) * 4,
    x: Math.cos(myAngle) * 4,
  };
  //    console.log(myAngle);

  weapons.push(
    new Weapon(
      canvas.width / 2,
      canvas.height / 2,
      20,
      "cyan",
      velocity,
      heavyWeaponDamage
    )
  );
});

addEventListener("keypress", (e) => {
  if (e.key === " ") {
    console.log("Enter key pressed");
    largeWeapons.push(new LargeWeapon(0, 0, LargeWeaponDamage));
  }
});

// console.log(`key: ${e.key}`)

animation();
