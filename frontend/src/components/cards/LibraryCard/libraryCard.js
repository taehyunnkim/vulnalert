import styles from "./LibraryCard.module.scss";

import { useState } from 'react';
import Switch from 'react-switch';

function LibraryCard(props) {
  const [alertEnabled, setAlertEnabled] = useState(props.alert_enabled);

  const cardTopClass = alertEnabled ? styles.cardTopEnabled : styles.cardTopDisabled;

  const onSwitchToggle = () => {
    setAlertEnabled(!alertEnabled);
  }

  return (
    <div className={styles.cardContainer}>
      <div className={`${cardTopClass} ${styles.cardTop}`}>
        <h1>{props.name}</h1>
        <p>{props.version}</p>
      </div>
      <div className={styles.cardBottom}>
        <div>
          <h2 className="subheader">REGISTERED</h2>
          <p>{props.register_date}</p>
        </div>
        <div className={styles.alertContainer}>
          <div className={styles.alertHeader}>
            {/* <img src="assets/icons/bell.svg" alt="bell icon"></img> */}
            <h2 className={"subheader"}>ALERT</h2>
          </div>
          <div className={styles.switchContainer}>
            <Switch
              checked={alertEnabled}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#715AFC"
              width={42}
              height={20}
              handleDiameter={12}
              onChange={() => onSwitchToggle()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryCard;