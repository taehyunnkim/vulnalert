import styles from "./Landing.module.scss";

import ProductShowcase from "./ProductShowcase"
import LoginForm from "./LoginForm"

export default function Landing(props) {
    return (
        <div className={styles.landing}>
            <div className={`${styles.panel} ${styles.leftpanel}`}>
                <ProductShowcase />
            </div>
            <div className={`${styles.panel} ${styles.rightpanel}`}>
                <LoginForm handleLogin={props.handleLogin} msal={props.msal} />
            </div>
        </div>
    );
}