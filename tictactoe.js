const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');
const pvpButton = document.getElementById('pvp');
const pveButton = document.getElementById('pve');

let gameActive = false;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let mode = '';

const winningConditions = 
[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleCellClick(clickedCell, clickedCellIndex) 
{
    if (gameState[clickedCellIndex] !== '' || !gameActive) 
    {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    checkWinner();
    if (mode === 'pve' && gameActive) 
    {
        currentPlayer = 'O';
        aiMove();
    }
}

function checkWinner() 
{
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) 
    {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') 
        {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) 
        {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        if (currentPlayer === 'X') {
            statusDisplay.innerHTML = `Player X wins!`;
        } else if (currentPlayer === 'O') {
            statusDisplay.innerHTML = `AI wins!`;
        }
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) 
    {
        statusDisplay.innerHTML = 'It\'s a Draw!';
        gameActive = false;
    }
}



function aiMove() 
{
    const blockingMove = findBlockingMove();
    if (blockingMove !== null) 
    {
        
        gameState[blockingMove] = 'O';
        document.getElementsByClassName('cell')[blockingMove].innerHTML = 'O';
    } 
    else 
    {
        
        const availableCells = gameState.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);
        if (availableCells.length > 0) 
        {
            const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
            gameState[randomIndex] = 'O';
            document.getElementsByClassName('cell')[randomIndex].innerHTML = 'O';
        }
    }
    checkWinner();
    currentPlayer = 'X'; 
}

function findBlockingMove() 
{
    for (let i = 0; i < winningConditions.length; i++) 
    {
        const [a, b, c] = winningConditions[i];
        const cells = [gameState[a], gameState[b], gameState[c]];
        const emptyIndex = cells.indexOf('') !== -1 ? cells.indexOf('') : -1;

        if (cells.filter(cell => cell === 'X').length === 2 && emptyIndex !== -1) 
        {
            return [a, b, c][emptyIndex];
        }
    }
    return null; 
}

function restartGame() 
{
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = '';
    restartButton.classList.add('hidden');

    Array.from(document.getElementsByClassName('cell')).forEach(cell => 
    {
        cell.innerHTML = '';
    });

    
    createBoard();
}

function createBoard() 
{
    while (board.firstChild) 
    {
        board.removeChild(board.firstChild);
    }

    for (let i = 0; i < 9; i++) 
    {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => handleCellClick(cell, i));
        board.appendChild(cell);
    }
}

pvpButton.addEventListener('click', () => 
{
    mode = 'pvp';
    startGame();
});

pveButton.addEventListener('click', () =>
{
    mode = 'pve';
    startGame();
});

function startGame() 
{
    gameActive = true;
    restartButton.classList.remove('hidden');
    createBoard();
}

restartButton.addEventListener('click', restartGame);
