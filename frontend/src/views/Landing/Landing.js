import styles from "./Landing.module.scss";

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Button from "components/forms/Button/Button";
import LibrarySearch from "components/forms/LibrarySearch/LibrarySearch";
import NavBar from "components/layouts/navigation/NavBar/NavBar";
import LoginForm from './LoginForm';
import Footer from "components/layouts/navigation/Footer/Footer";

export default function Landing({ handleLogin }) {
    const navigate = useNavigate();

    return (
        <div className={styles.appContainer}>
            <div className={styles.backgroundGradient}></div>
            <NavBar title="Home" />
            <Routes>
                <Route path="/" element={ 
                    <div className={styles.landing}>
                        <div className={`${styles.panel} ${styles.leftpanel}`}>
                            <div className={styles.intro}>
                                <h1>Application Security</h1>
                                <h1>Made Simple.</h1>
                                <p>You shouldn't need to be a security expert to secure your projects from vulnerabilities.</p>
                                <p>We proactively scan your Node.js libraries for vulnerabilities and sends alerts to you.</p>
                                <Button
                                    text="Get Started"
                                    type="primary"
                                    className={styles.button}
                                    onClick={() => navigate("/login")}
                                />

                                <div className={styles.explanationContainer}>
                                    <h2>How It Works</h2>
                                    <div>
                                        <div className={styles.explanationCard}>
                                            <img src="assets/icons/register-blue.gif" alt="Register Gif"></img>
                                            <h2>Register Libraries</h2>
                                        </div>
                                        <div className={styles.explanationCard}>
                                            <img src="assets/icons/email-blue.gif" alt="Alert Gif"></img>
                                            <h2>Get Alerted</h2>
                                        </div>
                                        <div className={styles.explanationCard}>
                                            <img src="assets/icons/resource-blue.gif" alt="Resource Gif"></img>
                                            <h2>Receive Resources</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.panel} ${styles.rightpanel}`}>
                            <LibrarySearch isDemo={true} />
                            <div className={`card-bg ${styles.demoVulnerability}`}>
                                <p className="subheader">NAME</p>
                                <h1>CVE-2022-32212</h1>
                                <div className={styles.infoBox}>
                                    <div>
                                        <h2 className="subheader">VERSION</h2>
                                        <h3>&lt;14.20.0, &lt;16.20.0</h3>
                                        <h3>&lt;18.5.0</h3>
                                    </div>
                                    <div>
                                        <h2 className="subheader">SEVERITY</h2>
                                        <h3 className="high">High</h3>
                                    </div>
                                </div> 
                                <div className={styles.descriptionBox}>
                                    <h2 className="subheader">DESCRIPTION</h2>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                 } />
                <Route path="/login" element={ <LoginForm handleLogin={handleLogin} /> } />
                <Route path="*" element={ <Navigate to="/" /> } />
            </Routes>
            <Footer />
        </div>
    );
}