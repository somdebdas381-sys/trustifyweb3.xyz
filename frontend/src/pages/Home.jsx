import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedWallet = localStorage.getItem('walletAddress');
        if (storedWallet) setWalletAddress(storedWallet);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                setWalletAddress(account);
                localStorage.setItem('walletAddress', account);
            } catch (error) {
                console.error("User denied account access or error occurred:", error);
                alert("Failed to connect wallet.");
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
            window.open('https://metamask.io/download.html', '_blank');
        }
    };

    const goToDashboard = () => {
        navigate('/login');
    };

    return (
        <div>
            <div className="particles"></div>

            <div className="logo-fixed">
                <img src="/finallogo.png" className="logo-img" alt="Trustify Logo" />
            </div>

            <div className="menu-fixed">
                <button className="menu-btn" onClick={toggleMenu}>☰</button>
                <div id="dropdown" className="dropdown" style={{ display: menuOpen ? 'block' : 'none' }}>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </div>
            </div>

            <section className="hero">
                <h1 className="gradient-text">
                    Decentralized Escrow for Freelancers
                </h1>
                <p>
                    Secure payments between clients and freelancers
                    without middlemen using blockchain technology.
                </p>

                <div className="buttons">
                    <button onClick={connectWallet} className="btn-primary">
                        {walletAddress 
                            ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
                            : 'Connect Wallet'}
                    </button>
                    <button onClick={goToDashboard} className="btn-secondary" style={{ marginLeft: '15px' }}>
                        Go to Dashboard
                    </button>
                </div>
            </section>

            <section className="features">
                <div className="feature-card">
                    <h3>Secure Escrow</h3>
                    <p>Payments are locked in smart contracts until work is completed.</p>
                </div>

                <div className="feature-card">
                    <h3>No Middleman</h3>
                    <p>Clients and freelancers transact directly without third parties.</p>
                </div>

                <div className="feature-card">
                    <h3>Blockchain Transparency</h3>
                    <p>Every transaction is permanently recorded on blockchain.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
