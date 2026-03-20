import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigators/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import PostProvider from './src/context/PostContext';
import { UserProvider } from './src/context/UserContext';
import SocketProvider from './src/context/SocketContext';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SocketProvider>
          <PostProvider>
            <UserProvider>
              <RootNavigator />
            </UserProvider>
          </PostProvider>
        </SocketProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

