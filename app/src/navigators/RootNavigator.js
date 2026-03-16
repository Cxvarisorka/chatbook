import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import { useAuth } from "../context/AuthContext";
import ProfileScreen from "../screens/ProfileScreen";
import FeedScreen from "../screens/FeedScreen";
import UsersScreen from "../screens/UsersScreen";


const Tab = createBottomTabNavigator();

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
                        <Tab.Screen name="users" component={UsersScreen} />
                    </>
                )
            }
        </Tab.Navigator>
    )
};

export default RootNavigator;