import { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

import styles from "./LoginForm.module.scss";


function LoginForm({ handleLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { instance } = useMsal();

    useEffect(() => {
        const callbackId = instance.addEventCallback((message) => {
            if (message.eventType === EventType.LOGIN_SUCCESS || 
                message.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) { 
                handleLogin(true, {
                    given_name: message.payload.idTokenClaims.given_name,
                    family_name: message.payload.idTokenClaims.family_name,
                    email: message.payload.idTokenClaims.email,
                    auth_time: message.payload.idTokenClaims.auth_time,
                    username: message.payload.idTokenClaims.preferred_username
                });
            } else if (message.eventType === EventType.LOGOUT_SUCCESS) {
                // handle this case in the future
            }
        });

        return () => {
            if (callbackId) {
                instance.removeEventCallback(callbackId);
            }
        }
        
    }, [email, password, instance, handleLogin]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (process.env.NODE_ENV === "development") {
            // dummy data
            handleLogin(true, {
                given_name: "Alex",
                family_name: "Hunt",
                email: "ahunt@uw.edu",
                auth_time: 1677151382,
                username: "itsalexhunt"
            });
        }
    };

    const handleMicrosoftSSO = async (event) => {
        if (process.env.NODE_ENV === "production") {
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
                handleLogin(false);
            }
        } else {
            // dummy data
            handleLogin(true, {
                given_name: "Alex",
                family_name: "Hunt",
                email: "ahunt@uw.edu",
                auth_time: 1677151382,
                username: "itsalexhunt"
            });
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