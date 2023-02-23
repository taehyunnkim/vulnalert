import styles from "./NavBar.module.scss";

export default function NavBar(props) {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <img className={styles.brandlogo} src="/logo-md.png" alt="Logo"></img>
                <h1 className="brandname">Vulnalert</h1>
                <span className={styles.divider}></span>
                <h2 className={styles.pagename}>{props.pagename}</h2>
                <div className={styles.spacing}></div>
                { props.isAuthenticated ? <button className={styles.logout} onClick={() => {props.handleLogout()}}>Logout</button> : "" }
            </nav>
        </header>
    );
}