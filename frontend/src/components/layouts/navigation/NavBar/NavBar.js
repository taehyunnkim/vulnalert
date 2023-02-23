import styles from "./NavBar.module.scss";

import { useMsal } from "@azure/msal-react";

import { useIsAuthenticated } from "@azure/msal-react";

export default function NavBar(props) {
    const isAuthenticated = useIsAuthenticated();
    const { instance }  = useMsal();

    const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        }).catch(e => {
            console.log(e);
        });
    }

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <img className={styles.brandlogo} src="/logo-md.png" alt="Logo"></img>
                <h1 className="brandname">Vulnalert</h1>
                <span className={styles.divider}></span>
                <h2 className={styles.pagename}>{props.pagename}</h2>
                <div className={styles.spacing}></div>
                { isAuthenticated ? <button className={styles.logout} onClick={() => {handleLogout()}}>Logout</button> : "" }
            </nav>
        </header>
    );
}