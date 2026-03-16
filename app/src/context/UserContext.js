import { useNavigation } from "@react-navigation/native";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const API_URL = 'http://192.168.100.3:3000/api';

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState(null);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentFriendRequests, setSentFriendRequests] = useState([]);

    const navigation = useNavigation();

    const getUserProfile = async (userId, setCurrentUser, user) => {
        try {
            const res = await fetch(`${API_URL}/users/${userId}`, {
                credentials: 'include'
            });
            const contentType = res.headers.get('content-type') || '';
            const isJsonResponse = contentType.includes('application/json');
            const result = isJsonResponse ? await res.json() : null;
    
            if (!res.ok) {
                throw new Error(result?.message || 'Failed to load profile');
            }
    
            if (!isJsonResponse) {
                throw new Error('Server returned an invalid response');
            }
    
            setCurrentUser(result.data.user);
        } catch (err) {
            Alert.alert('Error', err.message);
            setCurrentUser(user);
        }
    };

    const getUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/users`, {credentials: 'include'});

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            setUsers(result.data.users);
        } catch(err) {
            Alert.alert(err.message);
        }
    };

    const sendFriendRequest = async (to) => {
        try {
            const res = await fetch(`${API_URL}/friend-request/${to}`, {credentials: 'include', method: 'POST'});

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            Alert.alert(result.message);
            await getSentFriendRequests();
            return true;
        } catch(err) {
            Alert.alert(err.message);
            return false;
        }
    };

    const getFriendRequests = async () => {
        try {
            const res = await fetch(`${API_URL}/friend-request`, {credentials: 'include'});

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            setFriendRequests(result.data.friendRequests);
        } catch(err) {
            Alert.alert(err.message);
        }
    };

    const getSentFriendRequests = async () => {
        try {
            const res = await fetch(`${API_URL}/friend-request/sent`, {credentials: 'include'});

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            setSentFriendRequests(result.data.friendRequests);
        } catch(err) {
            Alert.alert(err.message);
        }
    };

    const cancelFriendRequest = async (to) => {
        try {
            const res = await fetch(`${API_URL}/friend-request/${to}`, {
                credentials: 'include',
                method: 'DELETE'
            });

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            Alert.alert(result.message);
            await getSentFriendRequests();
            return true;
        } catch(err) {
            Alert.alert(err.message);
            return false;
        }
    };

    useEffect(() => {
        getUsers();
        getFriendRequests();
        getSentFriendRequests();
    }, []);

    

    return (
        <UserContext.Provider
            value={{
                users,
                getUserProfile,
                sendFriendRequest,
                cancelFriendRequest,
                friendRequests,
                sentFriendRequests
            }}
        >
            { children }
        </UserContext.Provider>
    )
};
