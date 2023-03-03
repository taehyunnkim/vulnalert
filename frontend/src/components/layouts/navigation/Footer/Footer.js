import styles from "./Footer.module.scss";


export default function Footer(props) {
    return(
        <footer className={`${styles.footer} ${props.className}`}>
            <h1 className={"brandname " + styles.brandname}>Vulnalert</h1>
            <span className={"dot " + styles.dot}></span>
            <p className={styles.link}><a href="/">Contact</a></p>
            <span className={"dot " + styles.dot}></span>
            <p className={styles.link}><a href="/">Privacy Policy</a></p>

            <p className={styles.copyright}>© 2023</p>
        </footer>
    );
};