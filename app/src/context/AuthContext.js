import { useNavigation } from "@react-navigation/native";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://192.168.100.3:3000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    const autoLogin = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/auto-login`, {
                method: 'POST',
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            Alert.alert(`Welcome ${result.fullname}`);
            setUser(result);
        } catch(err) {
            Alert.alert(err.message);
        }
    };

    useEffect(() => {
        autoLogin();
    }, [])

    const signup = async (data) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            Alert.alert(result.message);
            navigation.navigate('login');
        } catch(err) {
            Alert.alert(err.message);
        }
    };

    const login = async (data) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            Alert.alert(`Welcome ${result.data.user.fullname}`);
            setUser(result.data.user);
        } catch(err) {
            Alert.alert(err.message);
        }
    };

    const logout = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            setUser(null);
            alert(result.message);
            navigation.navigate('login');
        } catch(err) {
            console.log(err.message);
        }
    }

    return (
        <AuthContext.Provider value={{signup, login, logout, user}}>
            { children }
        </AuthContext.Provider>
    )
};
