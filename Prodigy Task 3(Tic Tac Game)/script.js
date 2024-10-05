const boxes = document.querySelectorAll('.box');
const status = document.querySelector('#status');
const btnRestart = document.querySelector('#restart');

let currentPlayer = 'X'; 
let gameBoard = ['', '', '', '', '', '', '', '', '']; 
let gameActive = true; 

const winningCombinations = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8],  
    [0, 4, 8], 
    [2, 4, 6]  
];
let animationActive = false; 
let confettiArray = []; 
const canvas = document.getElementById('confetti-canvas');

function createConfettiPiece() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        width: Math.random() * 10 + 10,
        height: Math.random() * 30 + 10,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        speedY: Math.random() * 3 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1
    };
}

function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

   
    confettiArray = [];
    for (let i = 0; i < 100; i++) {
        confettiArray.push(createConfettiPiece());
    }

    animationActive = true; 
    animateConfetti(); 
}

function animateConfetti() {
    if (!animationActive) return; 

    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiArray.forEach((piece, index) => {
        ctx.save();
        ctx.translate(piece.x + piece.width / 2, piece.y + piece.height / 2);
        ctx.rotate(piece.rotation * Math.PI / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        ctx.restore();

        piece.y += piece.speedY;
        piece.rotation += piece.rotationSpeed;

     
        if (piece.y > canvas.height) {
            confettiArray[index] = createConfettiPiece();
        }
    });

    requestAnimationFrame(animateConfetti);
}


function stopConfetti() {
    animationActive = false; 
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
}

function handleClick(event) {
    const box = event.target;
    const index = box.dataset.ind;

    
    if (gameBoard[index] || !gameActive) return;

    
    gameBoard[index] = currentPlayer;
    box.textContent = currentPlayer;
    if (currentPlayer === 'X') {
        box.style.color = 'red';
    } else {
        box.style.color = 'blue';
    }
    if (checkWin(currentPlayer)) {
        status.textContent = `${currentPlayer} wins!`;
        gameActive = false; 
        startConfetti();
    } else if (gameBoard.every(cell => cell)) {
        status.textContent = 'It\'s a draw!';
        gameActive = false; 
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `${currentPlayer}'s turn`;
    }
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => gameBoard[index] === player);
    });
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    boxes.forEach(box => {
        box.textContent = '';
        box.style.color = '';
    });
    currentPlayer = 'X';
    status.textContent = 'Play';
    gameActive = true; 
}

boxes.forEach(box => box.addEventListener('click', handleClick));
btnRestart.addEventListener('click', () => {
    resetGame();   
    stopConfetti(); 
});


