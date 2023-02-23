import styles from "./EmptyCard.module.scss";

const EmptyCard = (props) => {
    return (
        <div className={styles.emptyCard}>
            <p>{props.message}</p>
        </div>
    );
};

export default EmptyCard;