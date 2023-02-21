import styles from "./Landing.module.scss";

import Box from "components/layouts/content/placeholder/Box/Box"

export default function Landing() {
    return (
        <div className={styles.landing}>
            <div className={`${styles.panel} ${styles.leftpanel}`}>
                <Box style={{
                    width: "100%",
                    height: "200px",
                }}/>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                <Box style={{
                    width: "100%",
                    height: "160px",
                }}/>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            </div>
            <div className={`${styles.panel} ${styles.leftpanel}`}>

            </div>
        </div>
    );
}