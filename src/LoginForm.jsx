import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config';
import './LoginForm.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            navigate('/notes');
        } catch (err) {
            setError('Błąd logowania: ' + err.message);
        }
    }

    return (
        <div className="login-main-content">
            <div className="login-container">
                <p>Zaloguj</p>
                <form className="input-container" onSubmit={handleLogin}>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        required
                    />
                    <input
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        type="password"
                        placeholder="Hasło"
                        required
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <p>Nie masz konta? <Link to='/register'>Zarejestruj się!</Link></p>
                    <button type="submit">Zaloguj</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
