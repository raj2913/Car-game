const score = document.querySelector('.score');
const highScore = document.querySelector('.highScore');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const ClickToStart = document.querySelector('.ClickToStart');
//query selector selects the first element that matches with the specified CSS selector( like class name is score)
//returns the element as an object

// Event Listeners 
//listens for click events when this button is clicked, start function will be executed
ClickToStart.addEventListener('click', Start);
//attaches event listener to the entire document, which listens for keydown events, so when a key is pressed down, keydown function will be executed
document.addEventListener('keydown', keydown); 
document.addEventListener('keyup', keyup);
// object keys will keep track of the state of keys whether pressed or not
// Track the state of arrow keys
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Player object
let player = {
    speed: 5,
    score: 0,
    highScore: 0
};

// Keydown event handler
function keydown(e) {
    keys[e.key] = true;
}

// Keyup event handler
function keyup(e) {
    keys[e.key] = false;
}

// Function to start the game
function Start() {
    gameArea.innerHTML = ""; // Clear any existing content
    startScreen.classList.add('hide'); // Hide the start screen
    player.isStart = true; // Flag that the game has started
    player.score = 0; // Reset score

    // Start the game loop  
    //requestAnimation frame will tell the browser ti execute a function before the next frame, play function will be repeatedly called
    window.requestAnimationFrame(Play);

    // Create road lines
    for (let i = 0; i < 5; i++) {
        let roadLines = document.createElement('div');//creates new div element for each roadline
        roadLines.setAttribute('class', 'roadLines'); //sets class of the newly div element to roadLines
        roadLines.y = (i * 140); //based on y value, position the road
        roadLines.style.top = roadLines.y + "px";
        gameArea.appendChild(roadLines);
    }//smake it visible in game area

    // Create opponent cars
    for (let i = 0; i < 3; i++) {
        let opponent = document.createElement('div');
        opponent.setAttribute('class', 'Opponents');
        opponent.y = (i * -300);
        opponent.style.top = opponent.y + "px";
        opponent.style.left = Math.floor(Math.random() * 350) + "px";
        opponent.style.backgroundColor = randomColor();
        gameArea.appendChild(opponent);
    }

    // Create the player's car
    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);
    player.x = car.offsetLeft//Initializes the x property of the player object to the current horizontal position of the car
    player.y = car.offsetTop;//car.offsetTop retrieves the distance of the car element from the top edge of its containing element (gameArea), which is used to keep track of its position
}

// Function to generate a random color
function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2);
    }
    return "#" + c() + c() + c(); // Return color in #RRGGBB format
}

// Game loop function
function Play() {
    let car = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();

    if (player.isStart) {
        moveLines();
        moveOpponents(car);

        if (keys.ArrowUp && player.y > (road.top + 70)) { player.y -= player.speed; }
        if (keys.ArrowDown && player.y < (road.height - 75)) { player.y += player.speed; }
        if (keys.ArrowRight && player.x < 350) { player.x += player.speed; }
        if (keys.ArrowLeft && player.x > 0) { player.x -= player.speed; }

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        // Update scores
        player.score++;
        player.speed += 0.01;

        if (player.highScore < player.score) {
            player.highScore++;
            highScore.innerHTML = "HighScore: " + player.highScore;
            highScore.style.top = "80px";
        }
        score.innerHTML = "Score: " + player.score;

        // Continue the game loop
        window.requestAnimationFrame(Play);
    }
}

// Function to move the road lines
function moveLines() {
    let roadLines = document.querySelectorAll('.roadLines');
    roadLines.forEach(function (item) {
        if (item.y >= 700) {
            item.y -= 700;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

// Function to move the opponent cars
function moveOpponents(car) {
    let opponents = document.querySelectorAll('.Opponents');
    opponents.forEach(function (item) {
        if (isCollide(car, item)) {
            endGame();
        }
        if (item.y >= 750) {
            item.y -= 900;
            item.style.left = Math.floor(Math.random() * 350) + "px";
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

// Function to check collision
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.top > bRect.bottom) ||
        (aRect.bottom < bRect.top) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
    );
}

// Function to end the game
function endGame() {
    player.isStart = false;
    player.speed = 5;
    startScreen.classList.remove('hide'); // Show the start screen again
}
