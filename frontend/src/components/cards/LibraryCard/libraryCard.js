import styles from "./LibraryCard.scss";

import { useState } from "react";

function LibraryCard() {
  const [checked, setChecked] = useState(false);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardTop}>

      </div>
      <div className={styles.cardBottom}>

      </div>
    </div>
  );
}

export default LibraryCard;