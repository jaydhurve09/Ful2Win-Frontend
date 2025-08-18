import React, { use } from 'react'
import { useContext,useState,useEffect } from 'react';
import { Ful2WinContext } from '../context/ful2winContext';
import { useParams } from 'react-router-dom';
import Header from './Header';
import BackgroundBubbles from './BackgroundBubbles';
import Navbar from './Navbar';
import FindMatch from './FindMatch';
import {
  FaTrophy,
  FaGamepad,
  FaUsers,
  FaClock,
  FaSearch,
  FaRupeeSign,
  FaCoins,
  FaArrowLeft
} from 'react-icons/fa';

const TournamentCard = ({
  id,
  name,
  entryFee,
  startTime,
  prizePool,
  participants = [],
  maxParticipants,
  imageUrl,
  status,
  endTime,
  tournamentType,
  currentPlayers = [],
  rules = {},
  onSelect
}) => {
  return (
    <div className={`relative w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 rounded-xl p-2  text-white overflow-hidden mb-[2px] shadow-md shadow-[#292828]`}>
      <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${status === 'live' ? 'bg-yellow-500 text-black' : status === 'completed' ? 'bg-gray-400 text-gray-900' : 'bg-yellow-500 text-black'}`}>
        2 Players
      </div>
      <div className="absolute top-2 right-1 text-[10px]">
        {
            <FaTrophy className="inline mr-1 text-[gold] text-sm   " />
        }
        <span className="text-sm  text-[gold]">One Winner</span>
      </div>
      <div className="flex gap-2 items-center mt-4">
        <img
          src={imageUrl || '/placeholder.jpg'}
          alt={name}
          className="w-12 h-14 rounded-md border border-white object-cover"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div className="text-[11px]">Prize Pool</div>
          <div className="text-base font-bold flex items-center">
            {tournamentType === 'coin' ? <FaCoins className="text-yellow-400 mr-1" /> : <FaRupeeSign className="text-yellow-400 mr-1" />} 
            {prizePool}
          </div>
          <div className="mt-1 text-[11px]">
            <FaUsers className="inline mr-1" />Online
          </div>
          
        </div>
        <div className="ml-1 flex flex-col items-end">
          <button
            className={`bg-green-500 hover:bg-green-600 text-black font-bold px-3 py-1 rounded-full text-xs whitespace-nowrap mb-1 ${ status === 'completed' ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-700' : ''}`}
            onClick={onSelect}
          >
         <div>{tournamentType === 'coin' ? <FaCoins className="inline mr-1" /> : <FaRupeeSign className="inline mr-1" />}{
      entryFee
   }
</div>
          </button>
        </div>
      </div>
    
    </div>
  );
};

const classicLobby = () => {
    const { tournaments , games} = useContext(Ful2WinContext);
    const [type, setType] = useState('cash');
    const gameId = useParams().gameId;
    const game = Array.isArray(games) ? games.find(g => g._id === gameId || g.id === gameId) : null;
    const [selectedTournament, setSelectedTournament] = useState(null);
    // Filter tournaments for this game
    const tournamentsForGame = Array.isArray(tournaments) ? tournaments.filter(t => t.game?._id === gameId || t.game?.id === gameId) : [];
    // Further filter by type
    const filteredTournaments = {
      cash: tournamentsForGame.filter(t => t.tournamentType === 'cash'),
      coins: tournamentsForGame.filter(t => t.tournamentType === 'coin'),
    };
    {console.log('Game:', game, 'Tournaments:', filteredTournaments);}
  return (
    <div className="min-h-screen flex flex-col bg-blueGradient text-white">
      {selectedTournament ? (
        <FindMatch 
          tournament={selectedTournament} 
          onClose={() => setSelectedTournament(null)} 
        />
      ) : (
        <>
          <BackgroundBubbles />
          <Header />
          
          {filteredTournaments[type] && filteredTournaments[type].length > 0 ? (
            <div className="p-4">   
                <h2 className="text-2xl font-bold mt-14 mb-4"> {game?.title || game?.name}</h2>
                 <div className='flex justify-between mb-4 m-2 '>
                  <h1  onClick={() => setType('cash')}
          className={`px-4 py-2 flex items-center justify-center mr-2 w-full rounded-full text-sm font-medium border ${
            type === 'cash'
              ? 'bg-yellow-500 text-gray-900 border-yellow-400'
              : 'bg-gray-800/50 text-white border-gray-700'
          }`}>Cash</h1>
                  <h1  onClick={() => setType('coins')}
          className={`px-4 py-2 flex items-center w-full ml-2 rounded-full text-sm font-medium border justify-center ${
            type === 'coins'
              ? 'bg-yellow-500 text-gray-900 border-yellow-400'
              : 'bg-gray-800/50 text-white border-gray-700'
          }`}>Coins</h1>

                 </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTournaments[type].map((tournament) => (
                    <TournamentCard
                        key={tournament._id}
                        id={tournament._id}
                        name={tournament.name}
                        entryFee={tournament.entryFee}
                        prizePool={tournament.prizePool}
                        participants={tournament.participants || []}
                        maxParticipants={tournament.maxParticipants}
                        imageUrl={game?.assets?.thumbnail || tournament.imageUrl}
                        status={tournament.status}
                        startTime={tournament.startTime}
                        endTime={tournament.endTime}
                        tournamentType={tournament.tournamentType}
                        currentPlayers={tournament.currentPlayers || []}
                        rules={game?.rules || {}}
                        onSelect={() => setSelectedTournament({
                          name: tournament.name,
                          entryFee: tournament.entryFee,
                          tournamentType: tournament.tournamentType,
                          imageUrl: game?.assets?.thumbnail || tournament.imageUrl,
                          gameId: game?._id || game?.id,
                        })}
                      />
                    ))}
                </div>
            </div>
          ) : (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">No Tournaments Found</h2>
            </div>
          )}
          <Navbar />
        </>
      )}
    </div>
  )
}

export default classicLobby
