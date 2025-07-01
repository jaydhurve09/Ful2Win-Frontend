import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaArrowLeft, FaRedo } from 'react-icons/fa';

const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

/**
 * Tests if a game URL is accessible
 * @param {string} url - The URL to test
 * @returns {Promise<Object>} Test result object
 */
const testGameUrl = async (url) => {
  if (!url) return { ok: false, error: 'No URL provided' };
  
  try {
    console.log('Testing game URL:', url);
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'omit'
    });
    
    const result = {
      url,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      redirected: response.redirected,
      type: response.type
    };
    
    console.log('URL test result:', result);
    return result;
  } catch (error) {
    const errorResult = {
      url,
      ok: false,
      error: error.message,
      name: error.name
    };
    console.error('Error testing game URL:', errorResult);
    return errorResult;
  }
};

const GameWrapper = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [gameUrl, setGameUrl] = useState('');
  const [gamePath, setGamePath] = useState('');
  
  // Handle game fetching
  const fetchGame = useCallback(async () => {
    if (!gameId) {
      setError('No game ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching game with ID: ${gameId}`);
      const response = await axios.get(`/api/games/${gameId}`, {
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
        validateStatus: (status) => status < 500
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.status === 200 && response.data?.success) {
        const gameData = response.data.data || response.data;
        setGame(gameData);
        setRetryCount(0);
      } else {
        throw new Error(response.data?.message || 'Failed to load game');
      }
    } catch (err) {
      console.error('Error loading game:', err);
      setError(err.message || 'Failed to load game. Please try again.');
      
      // Retry logic
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * (retryCount + 1);
        console.log(`Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchGame();
        }, delay);
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [gameId, retryCount]);

  // Fetch game data when component mounts or gameId changes
  useEffect(() => {
    fetchGame();
  }, [gameId, fetchGame]);

  // Handle game data fetching with backend sync
  useEffect(() => {
    let isMounted = true;
    let source = axios.CancelToken.source();
    
    const fetchGameData = async () => {
      if (!gameId) {
        if (isMounted) {
          setError('No game ID provided');
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        
        console.log(`[GameWrapper] Fetching game data for ID: ${gameId}`);
        const response = await axios.get(`/api/games/${gameId}`, {
          timeout: 10000,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Game-Id': gameId
          },
          withCredentials: true,
          cancelToken: source.token,
          validateStatus: (status) => status >= 200 && status < 500
        });

        console.log('[GameWrapper] Game data response:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });
        
        if (!isMounted) return;
        
        if (response.status === 200 && response.data?.success) {
          const gameData = response.data.data || response.data;
          
          // Validate game data structure
          if (!gameData) {
            throw new Error('Invalid game data received from server');
          }
          
          setGame(gameData);
          
          // Extract game URL from the response with priority:
          // 1. Direct URL
          // 2. assets.gameUrl (string or object)
          // 3. deployment.fullUrl
          // 4. deployment.baseUrl + iframePath
          let gameUrl = '';
          
          if (gameData.url) {
            gameUrl = gameData.url;
            console.log('[GameWrapper] Using direct URL from game data:', gameUrl);
          } else if (gameData.assets?.gameUrl) {
            gameUrl = typeof gameData.assets.gameUrl === 'string' 
              ? gameData.assets.gameUrl 
              : gameData.assets.gameUrl.baseUrl || '';
            console.log('[GameWrapper] Using URL from assets.gameUrl:', gameUrl);
          } else if (gameData.deployment?.fullUrl) {
            gameUrl = gameData.deployment.fullUrl;
            console.log('[GameWrapper] Using deployment.fullUrl:', gameUrl);
          } else if (gameData.deployment?.baseUrl) {
            const base = gameData.deployment.baseUrl.replace(/\/+$/, '');
            const path = (gameData.deployment.iframePath || '').replace(/^\/+/, '');
            gameUrl = path ? `${base}/${path}` : base;
            console.log('[GameWrapper] Constructed URL from baseUrl + iframePath:', gameUrl);
          } else {
            console.warn('[GameWrapper] No valid URL found in game data');
          }
          
          // Clean up and validate the URL
          if (gameUrl) {
            try {
              // Ensure it has a protocol
              if (!gameUrl.startsWith('http')) {
                gameUrl = `https://${gameUrl}`;
                console.log('[GameWrapper] Added protocol to URL:', gameUrl);
              }
              
              // Ensure it ends with a single slash
              gameUrl = gameUrl.replace(/\/+$/, '') + '/';
              
              console.log('[GameWrapper] Final game URL:', gameUrl);
              
              // Additional validation for the game URL
              try {
                new URL(gameUrl); // This will throw if URL is invalid
                setGameUrl(gameUrl);
                setGamePath(gameData.path || '');
                setRetryCount(0);
                
                // Optional: Send analytics or tracking event
                console.log('[GameWrapper] Game URL is valid and ready');
              } catch (urlError) {
                console.error('[GameWrapper] Invalid game URL:', urlError);
                throw new Error(`Invalid game URL: ${urlError.message}`);
              }
            } catch (error) {
              console.error('[GameWrapper] Error processing game URL:', error);
              throw error; // Re-throw to be caught by the outer catch
            }
          } else {
            console.warn('[GameWrapper] No game URL available');
            setGameUrl('');
          }
        } else {
          const errorMessage = response.data?.message || 
                              `Failed to load game data (Status: ${response.status})`;
          console.error('[GameWrapper] API error:', errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('[GameWrapper] Request canceled:', err.message);
          return; // Don't update state if the request was canceled
        }
        
        console.error('[GameWrapper] Error loading game data:', {
          error: err,
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        if (isMounted) {
          const errorMessage = err.response?.data?.message || 
                             err.message || 
                             'Failed to load game. Please try again.';
          setError(errorMessage);
          
          // Retry logic with exponential backoff
          if (retryCount < MAX_RETRIES) {
            const delay = RETRY_DELAY * Math.pow(2, retryCount);
            console.log(`[GameWrapper] Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
            
            const timeoutId = setTimeout(() => {
              if (isMounted) {
                setRetryCount(prev => prev + 1);
              }
            }, delay);
            
            return () => clearTimeout(timeoutId);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchGameData();
    
    // Cleanup function to cancel the request if the component unmounts
    return () => {
      isMounted = false;
      source.cancel('Component unmounted or game ID changed');
    };
  }, [gameId, retryCount, navigate]);

  // Process and validate the game URL
  const safeGameUrl = useMemo(() => {
    if (!gameUrl) return '';
    
    let url = gameUrl;
    
    try {
      // If URL is already absolute, ensure it ends with a slash
      if (url.startsWith('http')) {
        url = url.endsWith('/') ? url : `${url}/`;
      }
      // If it's a protocol-relative URL, add https:
      else if (url.startsWith('//')) {
        url = `https:${url}`.endsWith('/') ? `https:${url}` : `https:${url}/`;
      }
      // Otherwise, assume it's a path and add the current origin
      else {
        const base = window.location.origin;
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        url = `${base}/${cleanUrl}`.replace(/([^:]\/)\/+$/, '$1') + '/';
      }
      
      console.log('Final game URL for iframe:', url);
      
      // Test the URL asynchronously
      testGameUrl(url)
        .then(result => console.log('Game URL test result:', result))
        .catch(console.error);
      
      return url;
    } catch (error) {
      console.error('Error processing game URL:', { url, error });
      return url; // Return as is if there's an error
    }
  }, [gameUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-center">
        <div className="space-y-4">
          <FaSpinner className="animate-spin text-4xl text-purple-500 mx-auto" />
          <p className="text-white text-lg">Loading {game?.displayName || 'game'}...</p>
          {retryCount > 0 && (
            <p className="text-gray-400 text-sm">
              Attempt {retryCount + 1} of {MAX_RETRIES + 1}
            </p>
          )}
        </div>
      </div>
    );
  }


  if (error || !game) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-center bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-gray-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Game Loading Failed</h2>
          <p className="text-gray-300 mb-6">{error || 'The game could not be loaded.'}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => fetchGame()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-purple-500/20"
            >
              <FaRedo className="text-sm" />
              Try Again
            </button>
            <button 
              onClick={() => navigate('/games')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
            >
              <FaArrowLeft className="text-sm" />
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!gameUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-center bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-yellow-500/20">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">Configuration Required</h2>
          <p className="text-gray-300 mb-6">This game is not properly configured with a valid URL.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => fetchGame()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all"
            >
              <FaRedo className="text-sm" />
              Retry
            </button>
            <button 
              onClick={() => navigate('/games')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
            >
              <FaArrowLeft className="text-sm" />
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <FaSpinner className="animate-spin text-4xl text-white" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center text-white">
          <h2 className="mb-4 text-2xl font-bold">Error Loading Game</h2>
          <p className="mb-6">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/games')}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              <FaArrowLeft className="inline mr-2" /> Back to Games
            </button>
            <button
              onClick={fetchGame}
              className="flex items-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              <FaRedo className="mr-2" /> Try Again
            </button>
          </div>
        </div>
      ) : safeGameUrl ? (
        <div className="w-full h-full">
          <iframe
            src={safeGameUrl}
            title={game?.displayName || 'Game'}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock allow-orientation-lock"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => console.log('Iframe loaded successfully')}
            onError={(e) => {
              console.error('Iframe error:', e);
              console.error('Failed to load game from URL:', safeGameUrl);
              setError(`Failed to load game. Please check if the game URL is correct.`);
            }}
            loading="eager"
            style={{
              backgroundColor: 'transparent',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            key={safeGameUrl}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-white">Loading game...</div>
        </div>
      )}
    </div>
  );
};

export default GameWrapper;