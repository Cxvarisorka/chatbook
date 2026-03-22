import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import socket from "../configs/socket";
import { useAuth } from "./AuthContext";

const API_URL = 'http://192.168.100.3:3000/api';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [conversations, setConversations] = useState({});

    // Fetch user's groups from API
    const fetchGroups = async () => {
        try {
            const res = await fetch(`${API_URL}/messages/groups`, {
                credentials: 'include'
            });
            const result = await res.json();
            if (res.ok) {
                setGroups(result.data.groups);
            }
        } catch (err) {
            console.log('Failed to fetch groups:', err.message);
        }
    };

    // Fetch messages for a specific group
    const fetchMessages = async (groupId) => {
        try {
            const res = await fetch(`${API_URL}/messages/${groupId}`, {
                credentials: 'include'
            });
            const result = await res.json();
            if (res.ok) {
                setConversations(prev => ({
                    ...prev,
                    [groupId]: result.data.messages
                }));
            }
        } catch (err) {
            console.log('Failed to fetch messages:', err.message);
        }
    };

    // Send message via REST API and update state from response
    const sendMessage = async (groupId, text) => {
        try {
            const res = await fetch(`${API_URL}/messages/${groupId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ text })
            });
            const result = await res.json();
            if (res.ok) {
                const message = result.data.message;
                setConversations(prev => ({
                    ...prev,
                    [groupId]: [...(prev[groupId] || []), message]
                }));
            } else {
                Alert.alert(result.message || 'Failed to send message');
            }
        } catch (err) {
            Alert.alert('Failed to send message');
        }
    };

    // Handle incoming real-time messages from socket (skip own messages)
    const handleIncoming = useCallback(({ message }) => {
        if (message.senderId === user?._id) return;
        setConversations(prev => ({
            ...prev,
            [message.groupId]: [...(prev[message.groupId] || []), message]
        }));
    }, [user]);

    // Connect socket & join group rooms
    useEffect(() => {
        if (!user) return;

        socket.auth = user;
        socket.connect();

        fetchGroups();

        socket.on('group-message', handleIncoming);

        return () => {
            socket.off('group-message', handleIncoming);
            socket.disconnect();
        };
    }, [user]);

    // Join socket rooms when groups are loaded
    useEffect(() => {
        if (!user || groups.length === 0) return;

        groups.forEach(group => {
            socket.emit('join-group', { groupId: group._id, userId: user._id });
        });
    }, [groups, user]);

    // Find group for a specific friend (1-on-1 chat)
    const getGroupForFriend = (friendId) => {
        return groups.find(g =>
            g.members.includes(friendId) && g.members.includes(user._id)
        );
    };

    return (
        <SocketContext.Provider value={{
            socket, sendMessage, conversations, groups,
            fetchMessages, fetchGroups, getGroupForFriend
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
