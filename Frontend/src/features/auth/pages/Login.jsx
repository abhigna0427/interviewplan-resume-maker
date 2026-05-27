import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleLogin(formData);
            navigate("/");
        } catch (error) {
            console.log(error);
            alert(
                error?.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <main>
            <div className="form-container">
                <h1>Welcome Back</h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.875rem', textAlign: 'center', marginTop: '-0.75rem', marginBottom: '0.5rem' }}>
                    Sign in to continue your interview prep
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">
                        Login
                    </button>
                </form>
                <p style={{ fontSize: '0.875rem', textAlign: 'center', color: '#7d8590', margin: 0 }}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;