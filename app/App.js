import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigators/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import PostProvider from './src/context/PostContext';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <PostProvider>
          <RootNavigator />
        </PostProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

