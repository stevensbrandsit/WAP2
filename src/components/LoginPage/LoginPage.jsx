import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import osakaLogo from '../../assets/osaka_w_trans.png';
import iwaLogo from '../../assets/IWA.png';
import './LoginPage.css';

function LoginForm() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    function handleEmailChange(evt) {
        setEmail(evt.target.value);
    }

    function handlePasswordChange(evt) {
        setPassword(evt.target.value);
    }

    async function handleFormSubmit(evt) {
        evt.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch('/IWA/contracten/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password, contract: 'HANZEC1'})
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error)
            } else {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', email);
                localStorage.setItem('contract', 'HANZEC1');
                navigate('/dashboard');
            }
        } catch {
            setError('Er is een fout opgetreden tijdens het inloggen. Probeer het later opnieuw.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-root">
            <div className="login-bg" />
            <div className="login-container">
                <div className="login-card">
                    <div className="login-card__left">
                        <div className="login-card__content">
                            <form onSubmit={handleFormSubmit} className="login-form">
                                <h2 className="login-title">Welcome back</h2>
                                <p className="login-subtitle">Sign in to your account to continue</p>

                                {error && <div className="login-error">{error}</div>}
                                {token && <div className="login-success">Logged in! Redirecting...</div>}

                                <div className="login-field">
                                    <label htmlFor="email">Email</label>
                                    <input
                                      id="email"
                                      type="text"
                                      value={email}
                                      onChange={handleEmailChange}
                                      placeholder="name@organisation.com"
                                      required
                                    />
                                </div>

                                <div className="login-field">
                                    <label htmlFor="password">Password</label>
                                    <input
                                      id="password"
                                      type="password"
                                      value={password}
                                      onChange={handlePasswordChange}
                                      placeholder="Enter your password"
                                      required
                                    />
                                </div>

                                <button className="login-button" type="submit" disabled={loading}>
                                    {loading ? (
                                        <span className="login-button__loading">
                                            <span className="login-spinner" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>

                            <p className="login-footer">
                            </p>
                        </div>
                    </div>

                    <div className="login-card__right">
                        <div className="login-card__brand">
                            <h3>Osaka University</h3>
                            <p>IWA Research Platform</p>
                            <div className="login-logos">
                                <img className="login-logo" src={osakaLogo} alt="Osaka University" />
                                <img className="login-logo" src={iwaLogo} alt="IWA" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoginPage() {
    return <LoginForm />
}

export default LoginPage
