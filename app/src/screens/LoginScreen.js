import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native"
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if(!email || !password) {
            Alert.alert("Both fields are required!");
            return;
        };

        const data = {email, password};

        setEmail('');
        setPassword('');

        login(data);
    }

    return (
        <View>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-keyboard" />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
            <Button title="Login" onPress={handleLogin} />
        </View>
    )
};

export default LoginScreen;