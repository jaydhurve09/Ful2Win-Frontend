import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrophy, FaUsers, FaCoins, FaMoneyBillWave, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const TournamentLobby = ({ game, onSelectTournament }) => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tournaments?gameId=${gameId}`);
        if (response.data.success) {
          setTournaments(response.data.data);
        } else {
          toast.error('Failed to load tournaments');
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        toast.error('Error loading tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [gameId]);

  const handleJoinTournament = (tournament) => {
    setSelectedTournament(tournament);
    if (onSelectTournament) {
      onSelectTournament(tournament);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <FaArrowLeft className="text-xl text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {game?.name} - Tournaments
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.length > 0 ? (
            tournaments.map((tournament) => (
              <div 
                key={tournament._id}
                className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
                  selectedTournament?._id === tournament._id 
                    ? 'border-blue-500' 
                    : 'border-transparent hover:border-blue-300'
                } transition-all`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{tournament.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="flex items-center mr-3">
                          <FaUsers className="mr-1" />
                          {tournament.currentPlayers?.length || 0}/{tournament.maxPlayers}
                        </span>
                        <span className="flex items-center">
                          {tournament.tournamentType === 'cash' ? (
                            <FaMoneyBillWave className="text-green-500 mr-1" />
                          ) : (
                            <FaCoins className="text-yellow-500 mr-1" />
                          )}
                          {tournament.entryFee} {tournament.tournamentType === 'cash' ? '₹' : 'Coins'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {tournament.status?.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, ((tournament.currentPlayers?.length || 0) / tournament.maxPlayers) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{tournament.currentPlayers?.length || 0} joined</span>
                      <span>{tournament.maxPlayers} max</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <div>
                      <div className="font-medium">Prize Pool</div>
                      <div className="text-lg font-bold text-gray-800">
                        {tournament.prizePool} {tournament.tournamentType === 'cash' ? '₹' : 'Coins'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Starts In</div>
                      <div className="text-gray-800">
                        {new Date(tournament.startTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleJoinTournament(tournament)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    Join Tournament
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <FaTrophy className="text-5xl mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Tournaments Available</h3>
              <p className="text-gray-500 mb-6">There are no active tournaments for this game at the moment.</p>
              <button
                onClick={() => navigate(-1)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
              >
                <FaArrowLeft className="mr-2" /> Back to Game
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentLobby;
