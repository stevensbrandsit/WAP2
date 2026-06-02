import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import osakaLogo from '../../assets/osaka_w_trans.png';
import iwaLogo from '../../assets/IWA.png';

function LoginForm() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contract] = useState('HANZEC1'); // Fixed contract ID
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    function handleEmailChange(evt) {
        setEmail(evt.target.value);
    }

    function handlePasswordChange(evt) {
        setPassword(evt.target.value);
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
            <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center p-6">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-4.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <form onSubmit={handleFormSubmit}>
                                <h2 className="text-4xl font-bold m-0 text-brand-primary">Sign In</h2>
                                <h3 className="text-base text-black m-0 mt-2 mb-2">Enter your account information to continue</h3>
                                {error && <p className="text-red-500 font-medium">{error}</p>}
                                {token && <p className="text-green-600 font-medium">Logged in!</p>}
                                
                                <input 
                                  className="w-full px-3.5 py-3 text-base rounded-lg border border-gray-300 mt-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                                  type="text" id="email" name="email" onChange={handleEmailChange} placeholder="Email"
                                />
                                
                                <input 
                                  className="w-full px-3.5 py-3 text-base rounded-lg border border-gray-300 mt-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                                  type="password" id="password" name="password" onChange={handlePasswordChange} placeholder="Password"
                                />
                                
                                <button 
                                  className="w-full mt-6 text-white font-bold py-3 text-base font-medium rounded-xl border-0 cursor-pointer transition-all duration-75 shadow-md hover:opacity-90" 
                                  style={{ backgroundColor: '#2d287f' }}
                                  type="submit"
                                >
                                  Login
                                </button>

                                <div className="mt-4 h-px w-full bg-gray-200" />
                                
                                <p className="text-center text-black text-sm">If you do not have an account, please contact your administrator to get one.</p>
                            </form>
                        </div>
                    </div>

                    <div className="p-6 flex items-center justify-center">
                        <div className="text-center">
                            <img className="w-40 h-40 object-contain mb-4" src={osakaLogo} alt="Osaka university logo" />
                            <img className="w-40 h-40 object-contain" src={iwaLogo} alt="IWA logo" />
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