import styles from "./Button.module.scss";

const Button = (props) => {
    return (
        <button className={`${styles.button} ${styles[props.type]}`} onClick={() => props.onClick()}>{props.text}</button>
    );
};

export default Button;