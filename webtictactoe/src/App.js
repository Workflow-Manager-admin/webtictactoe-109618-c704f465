import React, { useState } from 'react';
import './App.css';

// Colors to match the requirements
const PRIMARY = '#4CAF50';
const SECONDARY = '#FFC107';
const ACCENT = '#2196F3';

// PUBLIC_INTERFACE
function getWinner(board) {
  /** Returns 'X', 'O' or null depending on winner */
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) return board[a];
  }
  return null;
}

// PUBLIC_INTERFACE
function isDraw(board) {
  /** Determines if the board is full and there's no winner */
  return board.every(Boolean) && !getWinner(board);
}

// --- Board Square Component ---
function Square({ value, onClick, disabled, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled}
      style={{
        color: value === 'X' ? PRIMARY : value === 'O' ? ACCENT : undefined,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: highlight ? SECONDARY : undefined,
        transition: 'background 0.2s'
      }}
      aria-label={value ? `Filled by ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}

// --- Game Board Grid ---
function Board({ board, onSquareClick, disabled, winningLine }) {
  return (
    <div className="ttt-board">
      {[0,1,2].map(row =>
        <div className="ttt-board-row" key={row}>
          {[0,1,2].map(col => {
            const idx = 3 * row + col;
            return (
              <Square
                key={idx}
                value={board[idx]}
                onClick={() => onSquareClick(idx)}
                disabled={!!board[idx] || disabled}
                highlight={winningLine && winningLine.includes(idx)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Status Header ---
function StatusHeader({ status, onRestart }) {
  return (
    <header className="ttt-status-header">
      <div className="ttt-status-text">{status}</div>
      <button className="ttt-btn-restart" onClick={onRestart}>Restart</button>
    </header>
  );
}

// --- Main TicTacToe App ---
// PUBLIC_INTERFACE
function App() {
  /**
   * Main container for the WebTicTacToe game.
   */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Compute win/draw state
  const winner = getWinner(board);
  let winningLine = null;
  if (winner) {
    // Find which line
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6],
    ];
    for (let line of lines) {
      const [a,b,c] = line;
      if (board[a] && (board[a] === board[b] && board[a] === board[c])) {
        winningLine = line;
        break;
      }
    }
  }

  function handleSquareClick(idx) {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  function handleRestart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw(board)) {
    status = "It's a Draw!";
  } else {
    status = `Next turn: ${xIsNext ? 'X' : 'O'}`;
  }

  // Main layout
  return (
    <div className="app ttt-app-bg">
      <nav className="navbar" style={{ background: '#161b22' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: PRIMARY }}>●</span> WebTicTacToe
            </div>
            <span style={{ color: ACCENT, fontWeight: 500, fontSize: 16, opacity: .65 }}>
              React Minimal UI
            </span>
          </div>
        </div>
      </nav>
      <main>
        <div className="container ttt-main-container">
          <div className="ttt-game-card">
            <StatusHeader status={status} onRestart={handleRestart} />
            <Board
              board={board}
              onSquareClick={handleSquareClick}
              disabled={!!winner || isDraw(board)}
              winningLine={winningLine}
            />
            <div className="ttt-footer-info">
              <span>
                <b style={{ color: PRIMARY }}>X</b> & <b style={{ color: ACCENT }}>O</b> alternate turns. Grid squares can't be changed once set.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
