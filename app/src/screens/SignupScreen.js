import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native"
import { useAuth } from "../context/AuthContext";

const SignupScreen = () => {
    const { signup } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');

    const handleLogin = () => {
        if(!email || !password) {
            Alert.alert("Both fields are required!");
            return;
        };

        const data = {email, password, fullname};

        setEmail('');
        setPassword('');

        signup(data);
    }

    return (
        <View>
            <TextInput placeholder="Fullname" value={fullname} onChangeText={setFullname} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-keyboard" />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
            <Button title="Signup" onPress={handleLogin} />
        </View>
    )
};

export default SignupScreen;