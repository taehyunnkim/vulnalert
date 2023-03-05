import styles from "./Button.module.scss";

const Button = (props) => {
    return (
        <button className={`${props.className} ${styles.button} ${styles[props.type]} ${props.padded ? styles.padded : ""}`} onClick={() => props.onClick()}>{props.text}</button>
    );
};

export default Button;