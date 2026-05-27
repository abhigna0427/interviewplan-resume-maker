import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";

const Register = () => {
    const navigate = useNavigate();
    const { handleRegister } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: "",
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
            await handleRegister(formData);
            navigate("/");
        } catch (error) {
            console.log(error);
            alert(
                error?.response?.data?.message ||
                "Register failed"
            );
        }
    };

    return (
        <main>
            <div className="form-container">
                <h1>Create Account</h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.875rem', textAlign: 'center', marginTop: '-0.75rem', marginBottom: '0.5rem' }}>
                    Join to access AI interview preparation
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        Register
                    </button>
                </form>
                <p style={{ fontSize: '0.875rem', textAlign: 'center', color: '#7d8590', margin: 0 }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;