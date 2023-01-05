
//--- CREATING CANVAS ---
const apiAddress = "https://strapi-production-e449.up.railway.app/api/";
const canvas = document.getElementById('canvas');
const canvasWidth = 128;
const canvasHeight = 128;
canvas.height = canvasHeight;
canvas.width = canvasWidth;
const ctx = canvas.getContext('2d');
const root = document.getElementById('root');

let pauseStart;
let pauseTime = 0;

let gameRunning = true;

// --- UI FUNCTIONS / API REQUESTS ---
function handleStartGameClick() {
    timeStarted = Date.now();
    startGame();
    document.getElementById('menu-container').classList.add('inactive')
}
function handlePauseClick() {
    if (gameRunning) {
        document.getElementById("ui-bottom--pause").classList.add("inactive")
        document.getElementById("ui-bottom--play").classList.remove("inactive")
        document.getElementById('ui-middle-wrap').classList.remove('inactive')
        pauseStart = Date.now();
        gameRunning = false;


    }
    else {
        document.getElementById("ui-bottom--play").classList.add("inactive")
        document.getElementById("ui-bottom--pause").classList.remove("inactive")
        document.getElementById('ui-middle-wrap').classList.add('inactive')

        pauseTime = pauseTime + (Date.now() - pauseStart);
        gameRunning = true;
        startGame();
    }
}
function playerDeadEvent() {
    document.getElementById('you-died').classList.remove('inactive');
}

function fetchLeaderboard() {
    fetch(apiAddress + "player-scores/")
        .then(res => res.json())
        .then(data => sortData(data.data))

    //Sort data based on score highest - lowest    
    function sortData(data) {
        console.log(data[0])
        let sortedData = [];
        while (data.length > 0) {
            let index = findHighest(data);
            sortedData.push(data[index]);
            data.splice(index, 1)
        }
        function findHighest(data) {
            let currentHighestScore = -1;
            let currentHighestScoreIndex;
            for (let i = 0; i < data.length; i++) {
                if (!data[i].attributes.score) { data[i].attributes.score = 0 }
                if (!data[i].attributes.name) { data[i].attributes.name = "anon" }

                if (currentHighestScore < 0) {
                    currentHighestScore = data[i].attributes.score
                    currentHighestScoreIndex = i;
                }
                else if (data[i].attributes.score > currentHighestScore) {
                    currentHighestScore = data[i].attributes.score;
                    console.log("Current highest score : " + currentHighestScore)
                    currentHighestScoreIndex = i;
                }
                console.log(currentHighestScore)
            }
            return currentHighestScoreIndex;
        }
        console.log(sortedData)
        displayData(sortedData)
    }

    function displayData(data) {
        data.forEach((data, i) => {
            document.getElementById('ui-middle--leaderboard').innerHTML +=
                `
            <div class="ui-middle--leaderboard-component-wrap">
                <div class="ui-middle--leaderboard-component_rank">${i + 1}</div>
                <div class="ui-middle--leaderboard-component_name">${data.attributes.name}</div>
                <div class="ui-middle--leaderboard-component_score">${data.attributes.score}pts</div>
            </div>

            `
        })
    }
}
fetchLeaderboard()

function postData() {
    let nameInput = document.getElementById('you-died--input').value
    console.log(nameInput);
    if (nameInput) {
        let formData = {
            "data": {
                "name": nameInput,
                "score": playerScore
            }
        }
        fetch(apiAddress + "player-scores/", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        }).then(() => {
            reload();
        })
    }
}

function reload() {
    location.reload();
}

//---ANIMATION IMAGE ADDRESSES --- 
let playerAnimations = {
    idle: {
        address: "images/character/idle",
        animations: {
            idleDown: [
                "/idle down1.png",
                "/idle down2.png",
                "/idle down3.png",
                "/idle down4.png",
            ],

            idleLeft: [
                "/idle left1.png",
                "/idle left2.png",
                "/idle left3.png",
                "/idle left4.png",
            ],

            idleRight: [
                "/idle right1.png",
                "/idle right2.png",
                "/idle right3.png",
                "/idle right4.png",
            ],

            idleUp: [
                "/idle up1.png",
                "/idle up2.png",
                "/idle up3.png",
                "/idle up4.png",
            ]
        }
    },
    walk: {
        address: "images/character/walk",
        animations: {
            walkDown: [
                "/walk down1.png",
                "/walk down2.png",
                "/walk down3.png",
                "/walk down4.png",
            ],

            walkLeft: [
                "/walk left1.png",
                "/walk left2.png",
                "/walk left3.png",
                "/walk left4.png",
            ],

            walkRight: [
                "/walk right1.png",
                "/walk right2.png",
                "/walk right3.png",
                "/walk right4.png",
            ],

            walkUp: [
                "/walk up1.png",
                "/walk up2.png",
                "/walk up3.png",
                "/walk up4.png",
            ]
        }
    },
    attack: {
        address: "images/character/attack",
        animations: {
            attackDown: [
                "/attack down1.png",
                "/attack down2.png",
                "/attack down3.png",
                "/attack down4.png",
            ],

            attackLeft: [
                "/attack left2.png",
                "/attack left1.png",
                "/attack left3.png",
                "/attack left4.png",
            ],

            attackRight: [
                "/attack right1.png",
                "/attack right2.png",
                "/attack right3.png",
                "/attack right4.png",
            ],

            attackUp: [
                "/attack up1.png",
                "/attack up2.png",
                "/attack up3.png",
                "/attack up4.png",
            ]
        }
    },
    dead: {
        address: "images/character/roll",
        animations: {
            dead: [
                "/roll down1.png",
                "/roll down2.png",
                "/roll down3.png",
                "/roll down4.png"
            ]
        }
    }
}
let enemyDead = [
    "images/enemy/enemy dead1.png",
    "images/enemy/enemy dead2.png",
    "images/enemy/enemy dead3.png",
    "images/enemy/enemy dead4.png",
    "images/enemy/enemy dead5.png",
]

//--- PRE-LOAD ANIMATION FRAMES AND IMAGES ---
let heart = new Image();
heart.src = "images/heart.png";
heart.width = 16;
heart.height = 16;
function preloadContent() {
    function preloadImage(src) {
        let image = new Image();
        image.src = src;
    }
    function preloadAnimations(animationsArray) {
        for (let i = 0; i < animationsArray.length; i++) {
            let animationArray = Object.values(animationsArray[i].animations);
            let animationAddress = animationsArray[i].address;
            animationArray.forEach((animation) => {
                animation.forEach((frame) => {
                    preloadImage(animationAddress + frame);
                })
            })
        }
    }
    enemyDead.forEach((frame) => {
        preloadImage(frame)
    })

    preloadAnimations(Object.values(playerAnimations));


}
preloadContent();

let enemies = [];
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visibleX = x;
        this.visibleY = y;
        this.image = new Image(64, 64);
        this.image.src = "images/enemy/enemy.png";
        this.hp = 100;
        this.dead = false;
        this.deathAnimationPosition = 0;
    }
}

let playerX = 32;
let playerY = 32;
let playerImage = new Image(64, 64);
let playerDirection = 2; //Set to DOWN as default
let playerHealth = 60;
let playerInvulnerable = false;
let playerInvulnerableDuration = 15; // change to alter player invulnerabilty duration after attacked
let playerInvulnerableDurationCount = playerInvulnerableDuration;
let playerInvulnerableAnimationToggle = 0;
let playerScore = 0;
let playerDeathAnimationPosition = 0;

let enemyHitRadius = 10; // change to alter radius (px) from enemy coords to count enemy hits player
let enemySpawnRate = 0.02;
let enemySpawnRateMultipier = 1.001
let animationPosition = 0;
let prevAnimationFrameArray;
let nextAnimationFrame = 0;

let attacking = false;
let attackHit = false;
let attackingDirection;
let attackingAnimationPosition = 0;
let prevAttack = 0;
let attackDelay = 500; //change to alter player attack speed

let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;

let timeStarted = false;
enemies.push(new Enemy(32, -52)) //Always spawn one enemy before randomly spawning 

//handles gameplay inputs and displays on canvas using setInterval as a frame timer
function loadNextFrame() {
    let timeElapsed = getElapsedTime();

    function getElapsedTime() {
        if (timeStarted) {
            let ms = Date.now() - timeStarted - pauseTime;
            let s = Math.floor(ms / 1000);
            let m = Math.floor(s / 60);
            let currentS = s - (m * 60);
            if (currentS < 10) {
                currentS = `0${currentS}`
            }
            return `${m} : ${currentS}`
        }
        return "0 : 00"
    }


    enemySpawnRate = enemySpawnRate * enemySpawnRateMultipier; //Chance for enemy to spawn each frame

    //--- SPAWN ENEMIES ---
    if (Math.random() < enemySpawnRate) {
        let randomArea = Math.random();
        let randomPosition = (Math.random() - 0.5) * 128;
        if (randomArea < 0.25) {
            //SPAWN TOP
            enemies.push(new Enemy((32 + randomPosition), -52))
        }
        else if (randomArea < 0.5) {
            //SPAWN BOTTOM
            enemies.push(new Enemy((32 + randomPosition), 148))
        }
        else if (randomArea < 0.75) {
            //SPAWN LEFT
            enemies.push(new Enemy(-64, (32 + randomPosition)))
        }
        else {
            //SPAWN RIGHT
            enemies.push(new Enemy(148, (32 + randomPosition)))
        }
    }
    //--- PLAYER MOVEMENT & ANIMATION ---

    let speed = 2; //Can change to control general player movement speed

    if (moveUp && moveLeft || moveUp && moveRight || moveDown && moveRight || moveDown && moveLeft) {
        //adjust speed for moving diagonally
        speed = speed / 1.41;
    }
    let prevPlayerX = playerX;
    let prevPlayerY = playerY;

    //moveUp/Down/Left/Right === 0 unless triggered by event listener, then moveUp/Down/Left/Right === 1
    if (playerY > -24) {
        playerY -= moveUp * speed;
    }
    if (playerY < 88) {
        playerY += moveDown * speed;
    }
    if (playerX > -26) {
        playerX -= moveLeft * speed;
    }
    if (playerX < 92) {
        playerX += moveRight * speed;
    }

    //Assign correct animation loop
    let animationFrameArray = playerAnimations.idle.animations.idleDown; // default
    let animationAddress;
    window.addEventListener('keydown', (event) => {
        if (event.key === "w" || event.key === "W") {
            moveUp = true;
        };
        if (event.key === "s" || event.key === "S") {
            moveDown = true;
        }
        if (event.key === "a" || event.key === "A") {
            moveLeft = true;
        }
        if (event.key === "d" || event.key === "D") {
            moveRight = true;
        }
        if (event.code === "Space") {
            event.preventDefault();//FIX : stops space from pressing some ui buttons
            if (Date.now() - prevAttack > attackDelay) {
                attackHit = true;
                attacking = true;
                attackingDirection = playerDirection;
                prevAttack = Date.now();
            }
        }
    })
    window.addEventListener('keyup', (event) => {
        if (event.key === "w" || event.key === "W") {
            moveUp = false;
        }
        if (event.key === "s" || event.key === "S") {
            moveDown = false;
        }
        if (event.key === "a" || event.key === "A") {
            moveLeft = false;
        }
        if (event.key === "d" || event.key === "D") {
            moveRight = false;
        }
    })
    //determines direction of movement
    if (playerY < prevPlayerY) {
        playerDirection = 1 //UP
    }
    if (playerY > prevPlayerY) {
        playerDirection = 2 //DOWN
    }
    if (playerX < prevPlayerX) {
        playerDirection = 3 //LEFT
    }
    if (playerX > prevPlayerX) {
        playerDirection = 4 //RIGHT
    }

    if (attacking) {
        animationAddress = playerAnimations.attack.address;
        if (attackingDirection === 1) {
            animationFrameArray = playerAnimations.attack.animations.attackUp;
        }
        if (attackingDirection === 2) {
            animationFrameArray = playerAnimations.attack.animations.attackDown;
        }
        if (attackingDirection === 3) {
            animationFrameArray = playerAnimations.attack.animations.attackLeft;
        }
        if (attackingDirection === 4) {
            animationFrameArray = playerAnimations.attack.animations.attackRight;
        }
        if (attackingAnimationPosition < animationFrameArray.length) {
            attackingAnimationPosition++
        }
        else {
            attacking = false;
            attackingAnimationPosition = 0;
        }
    }
    else if (!(playerY === prevPlayerY && playerX === prevPlayerX)) { //detects if player is moving
        animationAddress = playerAnimations.walk.address;

        if (playerDirection === 1) {
            animationFrameArray = playerAnimations.walk.animations.walkUp;
        }
        if (playerDirection === 2) {
            animationFrameArray = playerAnimations.walk.animations.walkDown;
        }
        if (playerDirection === 3) {
            animationFrameArray = playerAnimations.walk.animations.walkLeft;
        }
        if (playerDirection === 4) {
            animationFrameArray = playerAnimations.walk.animations.walkRight;
        }

    }
    else {
        animationAddress = playerAnimations.idle.address;

        if (playerDirection === 1) {
            animationFrameArray = playerAnimations.idle.animations.idleUp;
        }
        if (playerDirection === 2) {
            animationFrameArray = playerAnimations.idle.animations.idleDown;
        }
        if (playerDirection === 3) {
            animationFrameArray = playerAnimations.idle.animations.idleLeft;
        }
        if (playerDirection === 4) {
            animationFrameArray = playerAnimations.idle.animations.idleRight;
        }

    }

    //Animate from selected loop 

    //If animation loop is different, starts animation loop from beginning
    //e.g. if character changes direction
    if (prevAnimationFrameArray != animationFrameArray) {
        animationPosition = 0;
    }
    playerImage.src = animationAddress + animationFrameArray[animationPosition];

    //Stagger animation
    let animationSpeed = 1; //how many intervals to skip before next animation frame, can change to control animation speed

    nextAnimationFrame < animationSpeed ? nextAnimationFrame++ : nextFrame();
    function nextFrame() {
        animationPosition > animationFrameArray.length - 2 ? animationPosition = 0 : animationPosition++;
        nextAnimationFrame = 0;
    }
    prevAnimationFrameArray = animationFrameArray;

    //FIX : without this when moving diagonally, player image would land in-between pixels causing blurry effect
    //causes slightly inaccurate movement as result when moving diagonally
    let visiblePlayerX = (Math.round(playerX))
    let visiblePlayerY = (Math.round(playerY))


    //--- ENEMY ---
    let enemySpeed = 0.5;

    enemies.forEach((enemy) => {
        let dX = visiblePlayerX - enemy.x;
        let dY = visiblePlayerY - enemy.y;
        let distance = Math.sqrt(dX * dX + dY * dY);
        velX = dX / distance;
        velY = dY / distance;
        enemy.x = enemy.x + velX * enemySpeed;
        enemy.y = enemy.y + velY * enemySpeed;
        enemy.visibleX = Math.round(enemy.x);
        enemy.visibleY = Math.round(enemy.y);
    })

    //--- PLAYER HIT ENEMY TRACKING ---
    if (attackHit) {
        attackHit = false;
        playerAttack()
    }
    function playerAttack() {
        let hitboxWidth = 30;
        let hitboxHeight = 25;

        if (playerDirection === 1) {
            let playerLeft = playerX - hitboxWidth / 2;
            let playerRight = playerX + hitboxWidth / 2;
            let playerFront = playerY - hitboxHeight;
            enemies.forEach((enemy, i) => {
                if (enemy.x > playerLeft && enemy.x < playerRight) {
                    if (enemy.y < playerY && enemy.y > playerFront) {
                        hitEnemy(enemy, i)
                    }
                }
            })
        }
        if (playerDirection === 2) {
            let playerLeft = playerX + hitboxWidth / 2;
            let playerRight = playerX - hitboxWidth / 2;
            let playerFront = playerY + hitboxHeight;
            enemies.forEach((enemy, i) => {
                if (enemy.x < playerLeft && enemy.x > playerRight) {
                    if (enemy.y > playerY && enemy.y < playerFront) {
                        hitEnemy(enemy, i)
                    }
                }
            })
        }
        if (playerDirection === 3) {
            let playerLeft = playerY + hitboxWidth / 2;
            let playerRight = playerY - hitboxWidth / 2;
            let playerFront = playerX - hitboxHeight;
            enemies.forEach((enemy, i) => {
                if (enemy.y < playerLeft && enemy.y > playerRight) {
                    if (enemy.x < playerX && enemy.x > playerFront) {
                        hitEnemy(enemy, i)
                    }
                }
            })
        }
        if (playerDirection === 4) {
            let playerLeft = playerY - hitboxWidth / 2;
            let playerRight = playerY + hitboxWidth / 2;
            let playerFront = playerX + hitboxHeight;
            enemies.forEach((enemy, i) => {
                if (enemy.y > playerLeft && enemy.y < playerRight) {
                    if (enemy.x > playerX && enemy.x < playerFront) {
                        hitEnemy(enemy, i)
                    }
                }
            })
        }
        function hitEnemy(enemy, i) {
            console.log("hit")
            enemy.hp = enemy.hp - 50;
            if (enemy.hp > 0) {

                //Calculate knockback 

                let dX = visiblePlayerX - enemy.x;
                let dY = visiblePlayerY - enemy.y;
                let distance = Math.sqrt(dX * dX + dY * dY);
                let knockbackDistance = enemySpeed * 20;
                velX = dX / distance;
                velY = dY / distance;
                enemy.x = enemy.x - velX * knockbackDistance;
                enemy.y = enemy.y - velY * knockbackDistance;
                enemy.visibleX = Math.round(enemy.x);
                enemy.visibleY = Math.round(enemy.y);

                enemy.image.src = "images/enemy/enemy hit.png"
                setTimeout(() => {
                    enemy.image.src = "images/enemy/enemy.png"
                }, 200)
            }
            if (enemy.hp <= 0) { //When enemy is DEAD 
                enemy.dead = true;
                playerScore++;
            }
        }

    }

    // --- ENEMY HIT PLAYER TRACKING ---
    enemies.forEach((enemy) => {
        let dX = visiblePlayerX - enemy.x;
        let dY = visiblePlayerY - enemy.y;
        let distance = Math.sqrt(dX * dX + dY * dY);
        if (distance < enemyHitRadius && playerInvulnerable === false) {
            enemyHit()
        }
    })
    function enemyHit() {
        playerHealth = playerHealth - 20;
        playerInvulnerable = true;
        console.log(playerHealth)
    }

    if (playerInvulnerable === true) {
        if (playerInvulnerableDurationCount > 0) {
            playerInvulnerableDurationCount--
            playerInvulnerableAnimationToggle === 0 ? playerInvulnerableAnimationToggle = 1 : playerInvulnerableAnimationToggle = 0;
            if (playerInvulnerableAnimationToggle === 1) {
                playerImage.src = "images/transparent.png"
            }
        }
        else {
            playerInvulnerable = false;
            playerInvulnerableDurationCount = playerInvulnerableDuration;
            playerInvulnerableAnimationToggle = 0;
        }
    }

    // --- ENEMY DEATH ANIMATION ---
    enemies.forEach((enemy, i) => {
        if (enemy.dead) {
            if (enemy.deathAnimationPosition > enemyDead.length - 1) {
                enemies.splice(i, 1)
                return
            }
            enemy.image.src = enemyDead[enemy.deathAnimationPosition];
            enemy.deathAnimationPosition++;
        }
    })

    // --- PLAYER DEATH ANIMATION/EVENT ---
    if (playerHealth <= 0) {
        if (playerDeathAnimationPosition > playerAnimations.dead.animations.dead.length) {
            clearInterval(gameIntervalId);
            playerDeadEvent();
        }

        playerImage.src = playerAnimations.dead.address + playerAnimations.dead.animations.dead[playerDeathAnimationPosition];
        playerDeathAnimationPosition++;

    }
    //---DISPLAY PLAYER HEALTH---
    function displayPlayerHealth() {
        let amountOfHearts = playerHealth / 20;
        let xPos = 4;
        for (let i = 0; i < amountOfHearts; i++) {
            ctx.drawImage(heart, xPos, 115, 12, 12)
            xPos += 16;
        }

    }

    //---UPDATE CANVAS---
    playerImage.onload = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(playerImage, visiblePlayerX, visiblePlayerY)

        if (enemies.length > 0) {
            enemies.forEach((enemy) => {
                ctx.drawImage(enemy.image, enemy.visibleX, enemy.visibleY)
            })
        }

        ctx.font = "bold 10px Arial";
        ctx.textAlign = "left";

        ctx.fillText(`SCORE : ${playerScore}`, 0, 10)

        ctx.font = "bold 10px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`${timeElapsed}`, 126, 10)

        displayPlayerHealth();
    }


    console.log(gameRunning)
    if (gameRunning === false) {
        console.log("pause")
        clearInterval(gameIntervalId);
    }
}
loadNextFrame(); //loads 1 frame before player clicks 'PLAY' removing the load delay
function startGame() {
    gameIntervalId = setInterval(loadNextFrame, 50)
}

