import styles from "./LibraryCard.module.scss";

import { useEffect, useState, useRef } from 'react';
import Switch from 'react-switch';
import { debounce } from "lodash";

function LibraryCard(props) {
  const [alertEnabled, setAlertEnabled] = useState(props.alert_enabled);

  const debouncedFetchOptionsRef = useRef(null);
  const cardTopClass = alertEnabled ? styles.cardTopEnabled : styles.cardTopDisabled;

  useEffect(() => {
    debouncedFetchOptionsRef.current = debounce(setAlertFetch, 1000);

    return () => {
        debouncedFetchOptionsRef.current.cancel();
    };
}, []);

  const onSwitchToggle = () => {
    setAlertEnabled(!alertEnabled);
    if(process.env.NODE_ENV === "production"){
      debouncedFetchOptionsRef.current.cancel();
      debouncedFetchOptionsRef.current(!alertEnabled);
    }
  }

  const setAlertFetch = (enabled) => {
    const prevEnabled = alertEnabled;
    fetch("api/v1/alerts" , {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        name: props.name, 
        version: props.version,
        enabled: enabled
      })
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        setAlertEnabled(prevEnabled);
      }
    }).then(result => {
      setAlertEnabled(result.enabled);
    }).catch(error => console.error(error))
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