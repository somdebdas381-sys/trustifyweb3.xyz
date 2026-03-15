import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!role) {
            alert("Please select a role");
            return;
        }

        if (role === 'client') {
            localStorage.setItem('userRole', 'client');
            navigate("/dashboard");
        } else {
            localStorage.setItem('userRole', 'freelancer');
            navigate("/freelancer");
        }
    };

    return (
        <div className="login-container">
            <div className="auth-container">
                <h2>Create Trustify Account</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" required />
                    <input type="email" placeholder="Email Address" required />
                    <input type="password" placeholder="Password" required />
                    <input type="password" placeholder="Confirm Password" required />

                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "15px" }}>Sign Up</button>
                    
                    <div className="role-select" style={{ marginTop: "20px" }}>
                        <label>
                            <input 
                                type="radio" 
                                name="role" 
                                value="client" 
                                required 
                                checked={role === 'client'} 
                                onChange={(e) => setRole(e.target.value)} 
                            />
                            Client
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="role" 
                                value="freelancer" 
                                required 
                                checked={role === 'freelancer'} 
                                onChange={(e) => setRole(e.target.value)} 
                            />
                            Freelancer
                        </label>
                    </div>
                </form>

                <p className="auth-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
