import { Link } from 'react-router-dom';
import { useState } from 'react';
import { auth } from './config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './LoginForm.css'

function RegisterForm() {
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [pass2, setPass2] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    async function handleRegister(e) {
        e.preventDefault();

        if (!login.trim()) {
            setErrorMsg("Login nie może być pusty.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMsg("Podaj poprawny adres e-mail.");
            return;
        }

        if (pass.length < 6) {
            setErrorMsg("Hasło musi mieć co najmniej 6 znaków.");
            return;
        }

        if (pass !== pass2) {
            setErrorMsg("Hasła się różnią!");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            setErrorMsg("");
            alert("Rejestracja zakończona sukcesem!");
        } catch (error) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    setErrorMsg("Konto z tym adresem e-mail już istnieje.");
                    break;
                case "auth/invalid-email":
                    setErrorMsg("Nieprawidłowy adres e-mail.");
                    break;
                case "auth/weak-password":
                    setErrorMsg("Hasło jest zbyt słabe.");
                    break;
                default:
                    setErrorMsg("Wystąpił błąd: " + error.message);
            }
        }
    }

    return (
        <div className="login-main-content">
            <div className="login-container">
                <p>Formularz Rejestracji</p>
                <form className="input-container" onSubmit={handleRegister}>
                    <input value={login} onChange={e => setLogin(e.target.value)} type="text" placeholder="Login" />
                    <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="e-mail" />
                    <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Hasło" />
                    <input value={pass2} onChange={e => setPass2(e.target.value)} type="password" placeholder="Powtórz hasło" />
                    <p>Masz już konto? <Link to='/login'>Zaloguj się!</Link></p>
                    <button type="submit">Zarejestruj</button>
                </form>

                <div className={`errorSpace ${errorMsg ? 'visible' : ''}`}>
                    {errorMsg}
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
