import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const soundRef = useRef(null);
    const [role, setRole] = useState('');

    useEffect(() => {
        const handleInteraction = () => {
            if (soundRef.current) {
                soundRef.current.play().catch(e => console.log(e));
            }
        };

        // Play sound on click once
        document.addEventListener('click', handleInteraction, { once: true });
        
        // Also try playing on load
        if (soundRef.current) {
            soundRef.current.play().catch(e => console.log(e));
        }

        return () => {
            document.removeEventListener('click', handleInteraction);
        };
    }, []);

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
                <h2>Login to Trustify</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email Address" required />
                    <input type="password" placeholder="Password" required />

                    <div className="role-select">
                        <label>
                            <input 
                                type="radio" 
                                name="role" 
                                value="client" 
                                checked={role === 'client'} 
                                onChange={(e) => setRole(e.target.value)} 
                            /> Client
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="role" 
                                value="freelancer" 
                                checked={role === 'freelancer'} 
                                onChange={(e) => setRole(e.target.value)} 
                            /> Freelancer
                        </label>
                    </div>

                    <button className="btn-primary" type="submit" style={{width: "100%"}}>Login</button>
                </form>

                <p className="auth-text">
                    New user? <Link to="/signup">Sign Up</Link>
                </p>
            </div>

            <audio id="coinSound" ref={soundRef}>
                <source src="/sound.mp3" type="audio/mpeg" />
            </audio>

            <div className="coin-container">
                <div className="coin-container">
                    <img src="/rg2.png" className="coin coin1" alt="coin" />
                    <img src="/rg2.png" className="coin coin2" alt="coin" />
                    <img src="/rg2.png" className="coin coin3" alt="coin" />
                    <img src="/rg2.png" className="coin coin4" alt="coin" />
                    <img src="/rg2.png" className="coin coin5" alt="coin" />
                </div>
            </div>
        </div>
    );
};

export default Login;
