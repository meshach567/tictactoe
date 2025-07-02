'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JSX } from 'react/jsx-runtime';

type CellValue = 'rabbit' | 'carrot' | null;
type GameBoard = CellValue[];

const TicTacToe = () => {
  const [board, setBoard] = useState<GameBoard>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<CellValue>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const checkWinner = (squares: GameBoard): CellValue => {
    const lines: number[][] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number): void => {
    if (board[index] || winner || gameOver) return;

    const newBoard: GameBoard = [...board];
    newBoard[index] = 'rabbit';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
      return;
    }

    if (newBoard.every(cell => cell !== null)) {
      setGameOver(true);
      return;
    }
  };

  // AI move
  useEffect(() => {
    if (!isPlayerTurn && !winner && !gameOver) {
      const timer = setTimeout(() => {
        const availableMoves = board
          .map((cell, index) => cell === null ? index : null)
          .filter((val): val is number => val !== null);
        
        if (availableMoves.length > 0) {
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          const newBoard: GameBoard = [...board];
          newBoard[randomMove] = 'carrot';
          setBoard(newBoard);

          const gameWinner = checkWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
            setGameOver(true);
          } else if (newBoard.every(cell => cell !== null)) {
            setGameOver(true);
          } else {
            setIsPlayerTurn(true);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner, gameOver]);

  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setGameOver(false);
  };

  const renderCell = (index: number): JSX.Element => {
    const cellValue = board[index];
    return (
      <button
        key={index}
        onClick={() => handleClick(index)}
        className="w-20 h-20 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-xl flex items-center justify-center text-3xl hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
        disabled={cellValue !== null || winner !== null || gameOver || !isPlayerTurn}
      >
        {cellValue === 'rabbit' && (
          <span className="text-2xl animate-bounce">🐰</span>
        )}
        {cellValue === 'carrot' && (
          <span className="text-2xl animate-pulse">🥕</span>
        )}
      </button>
    );
  };

  const getGameStatus = (): string => {
    if (winner) {
      return winner === 'rabbit' ? 'Winner: Rabbit 🐰' : 'Winner: Carrot 🥕';
    }
    if (gameOver) {
      return 'Game is a draw!';
    }
    return isPlayerTurn ? 'Your turn (Rabbit)' : 'AI thinking...';
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (winner === 'rabbit') return 'default';
    if (winner === 'carrot') return 'destructive';
    if (gameOver) return 'secondary';
    return 'outline';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-emerald-50 flex items-center justify-center p-4">
      <Card className="bg-gradient-to-br from-pink-100/90 to-purple-100/90 backdrop-blur-sm shadow-2xl max-w-md w-full border border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-600 mb-4 tracking-wide">
            Karen&apos;s Tic-tac-toe
          </CardTitle>
          <Badge variant={getStatusVariant()} className="mx-auto px-6 py-2 text-base">
            {getGameStatus()}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Game Board */}
          <div className="grid grid-cols-3 gap-3">
            {Array(9).fill(null).map((_, index) => renderCell(index))}
          </div>

          {/* Restart Button */}
          <div className="text-center">
            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Restart Game
            </Button>
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🐰</span>
              <span>Rabbit</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🥕</span>
              <span>Carrot</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicTacToe;