import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigators/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import PostProvider from './src/context/PostContext';
import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <PostProvider>
          <UserProvider>
            <RootNavigator />
          </UserProvider>
        </PostProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

