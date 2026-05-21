import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                navigate('/dashboard');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError(`There's been an ultra rare error! Please try again later.`);
        }
    }

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                {error && <p style={{color: "red"}}>{error}</p>}
                {token && <p style={{color: "green"}}>Logged in!</p>}
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" onChange={handleEmailChange}/>
                <br/>
                <label htmlFor="password">Password</label>
                <input type="text" id="password" name="password" onChange={handlePasswordChange}/>
                <br/>
                <label htmlFor="contract">Contract ID</label>
                <input type="text" id="contract" name="contract" onChange={handleContractsChange}/>
                <br/>
                <button type="submit">Login</button>
            </form>
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