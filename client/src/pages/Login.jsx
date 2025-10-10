import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formObj = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        login(formObj);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            
            <input type="email" name="email" placeholder="Please enter email" required/>
            <input type="password" name="password" placeholder="Please enter password" required/>

            <button>Login</button>
        </form>
    )
};

export default Login;