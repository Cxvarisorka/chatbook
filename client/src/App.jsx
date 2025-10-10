import { Route, Routes } from "react-router";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

// Components
import Nav from "./components/Nav";
import { useAuth } from "./context/AuthContext";
import Profile from "./pages/Profile";
import Posts from "./pages/Posts";

const App = () => {
  const {user} = useAuth();

  return (
    <>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/posts" element={user ? <Posts /> : <Login />} />
      </Routes>
    
    </>
  )
};

export default App;