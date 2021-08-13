const GameArea = document.querySelector('.gameArea');
const Score = document.querySelector('.score');
const Dino = document.querySelector('.dino');

const ScoreSound = new Audio('./assets/scoresound.mp3');
const GameOverSound = new Audio('./assets/deadSound.mp3');

let SCORE = 0;
let SPAWN_TIME = 1200;
let SpawnInterval, GameInterval;

const Spawner = () => {
    SpawnInterval = setInterval(() => {
        let block = document.createElement("DIV");
        block.classList.add("block");
        GameArea.appendChild(block);

        block.addEventListener('animationiteration', () => {
            console.log(block.offsetLeft)
        });
    
        block.addEventListener('animationend', () => {
            
            block.remove();
            ScoreSound.play();
            SCORE += 10;
            Score.innerHTML = SCORE;
            // if(SCORE%100 === 0 && SPAWN_TIME > 600) {
            //     clearInterval(interval);
            //     SPAWN_TIME = SPAWN_TIME - 100;
            //     Spawner();
            // }
        });
    }, SPAWN_TIME);
}

const isAlive = () => {
    GameInterval = setInterval(() => {
        const Cactus = document.querySelectorAll('.block');
        if(Cactus && !!Cactus.length && Cactus[0].offsetLeft < 100 && Cactus[0].offsetLeft > 50 && Dino.offsetTop > 160){
            GameOverSound.play();
            alert('Score: ' + SCORE)
            RefreshGame(Cactus);
        }
    }, 10);
}

const jump = () => {
    if (!Dino.classList.contains('animation')) {
        Dino.classList.add("animation");
        setTimeout(() => {
            Dino.classList.remove("animation");
        }, 600);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.keyCode === 32) {
        jump()
    }
});

const StartGame = () => {
    Spawner();
    isAlive();
}

const RefreshGame = (cactus) => {
    clearInterval(GameInterval);
    clearInterval(SpawnInterval);
    cactus.forEach((el) => {
        el.remove();
    })
    SCORE = 0;
    Score.innerHTML = SCORE;
    StartGame();
}

StartGame();

function GoInFullscreen() {
	if(GameArea.requestFullscreen)
        GameArea.requestFullscreen();
	else if(GameArea.mozRequestFullScreen)
        GameArea.mozRequestFullScreen();
	else if(GameArea.webkitRequestFullscreen)
        GameArea.webkitRequestFullscreen();
	else if(GameArea.msRequestFullscreen)
        GameArea.msRequestFullscreen();
}

var isMobile = ( window.innerWidth <= 800 ) && ( window.innerHeight <= 900 ) 
if (isMobile) {
    alert('mobile')
    GoInFullscreen();
}