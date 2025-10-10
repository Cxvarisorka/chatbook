import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx'
import { AuthProivder } from './context/AuthContext.jsx';
import { PostProvider } from './context/PostContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProivder>
      <PostProvider>
        <App />
      </PostProvider>
    </AuthProivder>
  </BrowserRouter>
)
