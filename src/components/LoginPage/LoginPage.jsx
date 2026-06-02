import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import osakaLogo from '../../assets/osaka.png';
import iwaLogo from '../../assets/IWA.png';

function LoginForm() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contract, setContract] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    function handleEmailChange(evt) {
        setEmail(evt.target.value);
    }

    function handlePasswordChange(evt) {
        setPassword(evt.target.value);
    }

    function handleContractsChange(evt) {
        setContract(evt.target.value);
    }

    async function handleFormSubmit(evt) {
        evt.preventDefault();
        setError(null);
        try {
            const response = await fetch('/IWA/contracten/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password, contract})
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error)
            } else {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', email);
                localStorage.setItem('contract', contract);
                navigate('/dashboard');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError(`There's been an ultra rare error! Please try again later.`);
        }
    }

    return (
        <>
            <div className="root-bg">
                <div className="page-container">
                    <div className="form-container">
                        <div className="left-panel">
                            <div className="login-form">
                                <form onSubmit={handleFormSubmit}>
                                    <h2 className="form-title">Sign In</h2>
                                    <h3 className="form-subtitle">Enter your account information to continue</h3>
                                    {error && <p style={{color: "#d23b3b"}}>{error}</p>}
                                    {token && <p style={{color: "#2e7d32"}}>Logged in!</p>}
                                    <input className="form-input" type="text" id="email" name="email" onChange={handleEmailChange} placeholder="Email"/>
                                    <input className="form-input" type="password" id="password" name="password" onChange={handlePasswordChange} placeholder="Password"/>
                                    <input className="form-input" type="text" id="contract" name="contract" onChange={handleContractsChange} placeholder="Contract ID"/>
                                    <button className="form-submit" type="submit">Login</button>
                                    <div className="line"></div>
                                    <p className="footer">If you do not have an account, please contact your administrator to get one.</p>
                                </form>
                            </div>
                        </div>

                        <div className="right-panel">
                            <div style={{textAlign: 'center'}}>
                                <img className="logo" src={osakaLogo} alt="Osaka university logo" />
                                <img className="logo" src={iwaLogo} alt="IWA logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function LoginPage() {
    return (
        <>
            <LoginForm/>
        </>
    )
}
export default LoginPage