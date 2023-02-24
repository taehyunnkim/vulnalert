import styles from "./EmptyCard.module.scss";

const EmptyCard = (props) => {
    return (
        <div className={`${styles.emptyCard} ${props.styleClass}`}>
            <p>{props.message}</p>
        </div>
    );
};

export default EmptyCard;