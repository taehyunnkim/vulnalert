import styles from "./LibrariesPage.module.scss";

import Button from 'components/forms/Button/Button';
import EmptyCard from 'components/cards/EmptyCard/EmptyCard';

function LibrariesPage(props) {
    return (
        <div className={styles.librariesContainer}>
            <div className={`${styles.register} card-bg`}>
                <div className={styles.searchContainer}>
                    <label htmlFor="search">SEARCH LIBRARY</label>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            placeholder="Enter a library name..."
                        />
                        <img alt="search icon" src="/assets/icons/search.svg" />
                    </div> 
                </div>
                <div className={styles.versionContainer}>
                    <label htmlFor="version">VERSION</label>
                    <div className={styles.versionBox}>
                        <input
                            type="text"
                            id="version"
                            name="version"
                            readOnly="readOnly"
                            placeholder="Select"
                        />
                        <img alt="down caret icon" src="/assets/icons/down_arrow.svg" />
                    </div> 
                </div>
                <div className={styles.submitContainer}>
                    <label htmlFor="register">REGISTER</label>
                    <Button
                        text="Register Library" 
                        type="primary"
                    />
                </div>
            </div>
            <div className={`${styles.userlibraries} card-bg`}>
                <EmptyCard message="Register libraries to set up alerts!" />
            </div>
        </div>
    );
}


export default LibrariesPage;