import styles from "./NavBar.module.scss";

import Button from "components/forms/Button/Button";

export default function NavBar(props) {
    const intro = () => {
        if (props.user.given_name) {
            return "Hi, " + props.user.given_name + "!";
        } else {
            return "Hello!";
        }
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <img className={styles.brandlogo} src="/logo-md.png" alt="Logo"></img>
                <h1 className="brandname">Vulnalert</h1>
                <span className={styles.divider}></span>
                <h2 className={styles.pagename}>{props.pagename}</h2>
                <div className={styles.spacing}></div>
                { props.isAuthenticated ? <p className={styles.intro}>{intro()}</p>: "" }
                { props.isAuthenticated ? <Button text="Logout" type="warning" onClick={props.handleLogout} /> : "" }
            </nav>
        </header>
    );
}