import styles from "./Landing.module.scss";

import ProductShowcase from "./ProductShowcase"
import LoginForm from "./LoginForm"

export default function Landing() {
    return (
        <div className={styles.landing}>
            <div className={`${styles.panel} ${styles.leftpanel}`}>
                <ProductShowcase />
            </div>
            <div className={`${styles.panel} ${styles.rightpanel}`}>
                <LoginForm />
            </div>
        </div>
    );
}