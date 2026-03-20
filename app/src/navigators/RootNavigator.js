import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import { useAuth } from "../context/AuthContext";
import ProfileScreen from "../screens/ProfileScreen";
import FeedScreen from "../screens/FeedScreen";
import UsersScreen from "../screens/UsersScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ChatScreen from "../screens/ChatScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MessagesStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="messagesList"
                component={MessagesScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="chat"
                component={ChatScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

const RootNavigator = () => {
    const { user } = useAuth();

    return (
        <Tab.Navigator>
            {
                !user ? (
                    <>
                        <Tab.Screen name="login" component={LoginScreen} />
                        <Tab.Screen name="signup" component={SignupScreen} />
                    </>
                ) : (
                    <>
                        <Tab.Screen name="feed" component={FeedScreen}/>
                        <Tab.Screen name="profile" component={ProfileScreen} />
                        <Tab.Screen name="messages" component={MessagesStack} />
                        <Tab.Screen name="users" component={UsersScreen} />
                    </>
                )
            }
        </Tab.Navigator>
    );
};

export default RootNavigator;
