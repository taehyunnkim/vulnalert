import styles from "./Box.module.scss";

export default function Box(props) {
    return (
        <div className={styles.box} style={ props.style }></div>
    );
};