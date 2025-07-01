import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrophy, FaCoins, FaArrowLeft, FaRedo } from 'react-icons/fa';

// Game configuration
const CARD_PAIRS = 8; // 16 cards total (8 pairs)
const CARD_SYMBOLS = ['🎮', '🎲', '🎯', '🎳', '🎰', '🎪', '🎭', '♟️', '🎨', '🎯', '🎭', '🧩', '🎲', '🎪', '🎨', '🧩'];

const GamePlay = ({ game, mode, tournament, onExit }) => {
  const { gameId } = useParams();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Initialize game
  const initializeGame = useCallback(() => {
    // Create pairs of cards
    const symbols = CARD_SYMBOLS.slice(0, CARD_PAIRS);
    const cardPairs = [...symbols, ...symbols];
    
    // Shuffle cards
    const shuffled = [...cardPairs]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false
      }));

    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameComplete(false);
    setGameStarted(false);
    setCountdown(3);
  }, []);

  // Start game with countdown
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
    }
  }, [countdown, gameStarted]);

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      const [firstIndex, secondIndex] = flipped;
      
      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        // Match found
        setSolved([...solved, firstIndex, secondIndex]);
        setFlipped([]);
        
        // Check if game is complete
        if (solved.length + 2 === CARD_PAIRS * 2) {
          setGameComplete(true);
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
      
      setMoves(moves + 1);
    }
  }, [flipped, cards, solved, moves]);

  // Handle card click
  const handleCardClick = (index) => {
    if (!gameStarted || gameComplete) return;
    if (flipped.length >= 2 || flipped.includes(index) || solved.includes(index)) return;
    
    setFlipped([...flipped, index]);
    
    // Flip the card in the cards state
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
  };

  // Calculate score based on moves (lower is better)
  const calculateScore = useCallback(() => {
    const baseScore = 1000;
    const penalty = moves * 10;
    return Math.max(0, baseScore - penalty);
  }, [moves]);

  // Render countdown
  if (countdown > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-8xl font-bold text-blue-600 animate-bounce">
            {countdown}
          </div>
          <p className="mt-4 text-gray-600">Get ready!</p>
        </div>
      </div>
    );
  }

  // Render game complete screen
  if (gameComplete) {
    const score = calculateScore();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Game Complete! 🎉</h2>
          <div className="space-y-4 mb-8">
            <p className="text-lg">You completed the game in <span className="font-bold">{moves}</span> moves!</p>
            <p className="text-2xl font-bold text-blue-600">Score: {score}</p>
            {tournament && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left mt-4">
                <div className="flex items-center">
                  <FaTrophy className="text-yellow-500 mr-2" />
                  <p className="font-bold">Tournament: {tournament.name}</p>
                </div>
                <p className="text-sm mt-1">Prize Pool: {tournament.prizePool} {tournament.tournamentType === 'cash' ? '₹' : 'Coins'}</p>
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={initializeGame}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <FaRedo className="mr-2" /> Play Again
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Exit Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <button
              onClick={onExit}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-2"
            >
              <FaArrowLeft className="mr-2" /> Exit Game
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {game?.name || 'Memory Match'}
              <span className="ml-2 text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {mode}
              </span>
            </h2>
          </div>
          
          <div className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow-sm">
            <div className="text-center">
              <p className="text-xs text-gray-500">Moves</p>
              <p className="font-bold text-lg">{moves}</p>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Pairs Found</p>
              <p className="font-bold text-lg">{solved.length / 2} / {CARD_PAIRS}</p>
            </div>
            <button 
              onClick={initializeGame}
              className="ml-2 p-2 text-gray-500 hover:text-blue-600 transition"
              title="Restart Game"
            >
              <FaRedo />
            </button>
          </div>
        </div>

        {tournament && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 flex items-center">
            <FaTrophy className="text-yellow-500 mr-2" />
            <span className="font-medium">Tournament Mode</span>
          </div>
        )}

        {/* Game Board */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {!gameStarted ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-blue-500 text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-700">Get Ready to Play!</h3>
              <p className="text-gray-500 mt-2">Match all pairs to win</p>
              <button
                onClick={() => setGameStarted(true)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Start Game
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {cards.map((card, index) => {
                const isFlipped = flipped.includes(index) || solved.includes(index);
                const isMatched = solved.includes(index);
                
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 transform ${isFlipped ? 'rotate-y-180' : ''} ${
                      isMatched 
                        ? 'bg-green-100 text-green-600' 
                        : isFlipped 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-500 shadow-md hover:shadow-lg'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    <div className={`${isFlipped ? 'block' : 'hidden'}`}>
                      {card.symbol}
                    </div>
                    {!isFlipped && (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">?</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div ref={gameContainerRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Game will be rendered here */}
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading game...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">How to Play:</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Click on cards to flip them and find matching pairs</li>
            <li>Match all pairs with the fewest moves to get a higher score</li>
            <li>Complete the game before time runs out in tournament mode</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
