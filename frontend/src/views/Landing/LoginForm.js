import { useState, useEffect } from 'react';
import { useMsal, useAccount } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";

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
        if (process.env.NODE_ENV === "production") {
            if (account) {
                instance.acquireTokenSilent({
                    scopes: ["User.Read"],
                    account: account
                }).then((response) => {
                    const accessToken = response.accessToken;
                    fetch('/api/v1/users/ms-login', {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }).then((response) => {
                        if (response.ok) {
                            handleLogin(true, {
                                given_name: account.idTokenClaims.given_name,
                                family_name: account.idTokenClaims.family_name,
                                email: account.idTokenClaims.email,
                                auth_time: account.idTokenClaims.auth_time,
                                username: account.idTokenClaims.preferred_username
                            });
                        } else {
                            // Handle Login failed...
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log("No refresh token. Please log in...");
                });
            }
        }

    }, [instance, account, handleLogin]);

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
                await instance.loginPopup(loginRequest);
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