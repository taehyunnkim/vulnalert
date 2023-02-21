import Box from "components/layouts/placeholder/Box/Box"

import styles from "./ProductShowcase.module.scss";

export default function ProductShowcase() {
    return (
        <div className={styles.showcase}>
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
    );
}