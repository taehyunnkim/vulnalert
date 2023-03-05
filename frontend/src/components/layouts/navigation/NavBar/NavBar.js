import styles from "./NavBar.module.scss";

import { Link, useLocation } from "react-router-dom"

import Button from "components/forms/Button/Button";

export default function NavBar(props) {
    const location = useLocation();

    const intro = () => {
        if (props.user === undefined || props.user.given_name === undefined) {
            return "Hello!";
        } else {
            return "Hi, " + props.user.given_name + "!";
        }
    };

    return (
        <header className={`${props.isAuthenticated ? styles.authenticatedHeader : styles.header}`}>
            <nav className={`${styles.nav} ${props.isAuthenticated ? styles.authenticatedNav : styles.landingNav}`}>
                <img className={styles.brandlogo} src="/logo-md.png" alt="Logo"></img>
                <Link to="/"><h1 className="brandname">Vulnalert</h1></Link>
                <span className={styles.divider}></span>
                <h2 className={styles.pagename}>{props.title}</h2>
                <div className={styles.spacing}></div>
                { props.isAuthenticated ? <p className={styles.intro}>{intro()}</p>: "" }
                { props.isAuthenticated 
                    ? <Button text="Logout" type="warning" onClick={props.handleLogout} /> 
                    : location.pathname === "/login" ? "" : <Link to="/login" className={styles.hidden}><h2 className={styles.myAccount}>My Account</h2></Link>
                }
            </nav>
        </header>
    );
}