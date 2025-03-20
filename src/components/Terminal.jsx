import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { getAuthToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const formatTerminalOutput = (text) => {
    return text.split('\n').map((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 9) {
            return { type: 'text', text: line };
        }
        return {
            permissions: parts[0],
            links: parts[1],
            owner: parts[2],
            group: parts[3],
            size: parts[4],
            date: `${parts[5]} ${parts[6]} ${parts[7]}`,
            name: parts.slice(8).join(' '),
        };
    });
};

const TerminalInput = ({ onSubmit, osInfo }) => {
    const [inputValue, setInputValue] = useState('');
    const [osData, setOsData] = useState({});
    const inputRef = useRef(null);
    const [showCursor, setShowCursor] = useState(true);

    const truncatePath = (path) => path?.split('/').slice(-2).join('/') || path;

    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setOsData(osInfo);
    }, [osInfo]);

    return (
        <div className="flex items-center whitespace-nowrap overflow-hidden">
            <span className="text-green-400 select-none">{osData.user}</span>
            <span className="text-white">@</span>
            <span className="text-blue-400 select-none">{osData.host}</span>
            <span className="text-white px-1">:</span>
            <span className="text-yellow-400 select-none truncate max-w-xs">{truncatePath(osData?.path)}</span>
            <span className="text-green-400 ml-1">$</span>
            <input
                ref={inputRef}
                className="flex-1 bg-black text-white outline-none font-mono text-sm ml-2 py-1 placeholder-gray-500 truncate"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (onSubmit(inputValue), setInputValue(''))}
                spellCheck={false}
                placeholder=" Type your command..."
                autoFocus
            />
        </div>
    );
};

const Terminal = ({ open, onClose }) => {
    const navigate = useNavigate();
    const token = getAuthToken();
    const messagesEndRef = useRef(null);
    const [entries, setEntries] = useState([]);
    const [osInfo, setOsInfo] = useState({});
    const socketRef = useRef(null);
   // const socketURL = 'http://board-api.duckdns.org:5000';
    const socketURL = process.env.NODE_ENV === 'production' 
    ? 'wss://board-api.duckdns.org' 
    : 'ws://localhost:5000';
    const addEntry = (type, content) => {
        setEntries((prev) => [...prev, { type, content }]);
    };

    const clearMessages = () => {
        setEntries([]);
    };

  useEffect(() => {
    if (!token) {
        navigate('/login');
        return;
    }

    const connectSocket = () => {
        
		const socket = io(socketURL, {
		    auth: { token },
		    //extraHeaders: { Authorization: `Bearer ${token}` },
		    transports: ['websocket'], // Ensure it only tries WebSocket
		});
	       
		socketRef.current = socket;

		socket.on('connect', () => {
		  console.log(`Client connected: ${socket.id}`);
		    console.log('Socket.IO connected');
		});

		socket.on('systemInfo', (data) => {
		    setOsInfo(data);
		});

		// ✅ Prevent duplicate event listeners
		socket.off('output'); // Remove previous listener before adding a new one
		socket.on('output', (data) => {
		    addEntry('message', data);
		});

		socket.on('error', (data) => {
		    addEntry('error', data);
		});

		socket.on('disconnect', (data) => {
		    console.log('Socket.IO disconnected', data);
		    addEntry('Socket.IO disconnected', data);
		    setTimeout(connectSocket, 3000);
		});

		socket.on('connect_error', (error) => {
		    console.log('connect_error', error);
		    console.error('Socket.IO connection error:', error);
		});
        
    };
    if (!socketRef.current) {
    connectSocket();
   }
    return () => {
        if (socketRef.current) {
            socketRef.current.off('output'); // ✅ Remove event listener on unmount
            socketRef.current.disconnect();
        }
    };
}, [token, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [entries]);

    const handleCommandSubmit = (inputValue) => {
        if (socketRef.current) {
            socketRef.current.emit('command', inputValue);
            addEntry('command', `$ ${inputValue}`);
        }
    };

    return (
        <div className="bg-black border-t border-gray-600 flex flex-col w-full h-full fixed top-0 left-0">
            <div className="flex justify-between items-center bg-neutral-900 text-white px-2 h-8">
                <span className="text-green-500 font-mono">
                    <Icon icon="mdi:console" width={16} className="inline-block mr-1" /> CodEdit Web Terminal
                </span>
                <div className="flex gap-2">
                    <button onClick={clearMessages} className="text-green-500 text-sm">
                        <Icon icon="mdi:trash-can-outline" width={12} />
                    </button>
                </div>
            </div>
            <div className="border-t border-gray-700"></div>
            <div className="flex-1 overflow-y-auto p-2 bg-black font-mono text-sm text-left max-w-full break-words">
                <div className="">
                    {osInfo && (
                        <div className="grid grid-cols-2 gap-1 w-full justify-between text-green-500">
                            {Object.entries(osInfo).map(([key, value]) => (
                                <div key={key} className="flex ">
                                    <span className="font-bold min-w-40 text-neutral-200">{key}:</span>
                                    <span className="text-cyan-400">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {entries.map((entry, index) => (
                    <div key={index}>
                        <div className={`${entry.type === 'command' ? 'font-bold text-green-500' : 'text-white'}`}>
                            <pre className={`whitespace-pre-wrap break-words ${entry.type === 'command' ? 'font-bold text-green-500' : ''}`}>
                                {entry.content}
                            </pre>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <TerminalInput onSubmit={handleCommandSubmit} osInfo={osInfo} />
        </div>
    );
};

export default Terminal;
