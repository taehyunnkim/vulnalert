import { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest, graphRequest } from "../../authConfig";

import styles from "./LoginForm.module.scss";


function LoginForm(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { instance, accounts } = useMsal();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    };

    const handleMicrosoftSSO = async (event) => {
        try {
            const loginResponse = await instance.loginPopup(loginRequest);
            const idToken = loginResponse.idToken;
            await fetch('/api/v1/users/ms-login', {
                method: "POST",
                headers: {
                  'Authorization': `Bearer ${idToken}`
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.logincontainer}>
            <h1>Sign in</h1>
            <h2>to use our service.</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />

                <button type="submit">Sign in</button>
                <p className={styles.register}>Don't have an account? <a href="/">Sign up</a></p>
            </form>

            <div className={styles.sso}>
                <h2>Single Sign-on</h2>
                <img 
                    className={styles.msbutton} 
                    src="/assets/ms-signin.svg" 
                    alt="Log in with Microsoft"
                    onClick={() => handleMicrosoftSSO()}
                ></img>
            </div>
        </div>
    );
}


export default LoginForm;