import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import socket from "../configs/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState({});

    const sendMessage = (to, message) => {
        const msg = { from: user._id, to, message, createdAt: new Date().toISOString() };
        socket.emit('private-message', { to, message });
        setConversations(prev => ({
            ...prev,
            [to]: [...(prev[to] || []), msg]
        }));
    };

    const handleIncoming = ({ from, message, createdAt }) => {
        const msg = { from, message, createdAt };
        setConversations(prev => ({
            ...prev,
            [from]: [...(prev[from] || []), msg]
        }));
    };

    useEffect(() => {
        if (!user) return;

        socket.auth = user;
        socket.connect();

        socket.on('private-message', handleIncoming);

        return () => {
            socket.off('private-message', handleIncoming);
        };
    }, [user, handleIncoming]);

    return (
        <SocketContext.Provider value={{ socket, sendMessage, conversations }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
