import { useState, useEffect } from 'react';
import { useMsal, useAccount } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import styles from "./LoginForm.module.scss";


function LoginForm({ handleLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { instance, accounts }  = useMsal();
    const account = useAccount(accounts[0] || {});

    // After the user has successfully logged in
    // we create an access token and send it to our backend
    // so that we could access the Graph API for further
    // processing.
    useEffect(() => {
        

    }, [instance, account, handleLogin]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    };

    const handleRegister = async (event) => {
        toast.info("Registration is currently disabled. Please log in with your UW Net ID with Microsoft SSO.", 10000);
    };

    const handleMicrosoftSSO = async (event) => {
        if (process.env.NODE_ENV === "production") {
            const interactionIncomplete = Cookies.get('msal.interaction.status');

            if (interactionIncomplete) {
                toast.error("Microsoft sign out was incomplete.", 10000);
                toast.info("Please reload the page!", 10000);
            } else {
                await instance
                    .loginRedirect(loginRequest)
                    .then(res => {
                        if (res.ok) {
                            handleLogin();
                        }
                    })
                    .catch(e => {});
            }
        } else {
            handleLogin();
        }
    }

    return (
        <div className={styles.logincontainer}>
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
                <p className={styles.register}>Don't have an account? <a onClick={handleRegister}>Sign up</a></p>
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