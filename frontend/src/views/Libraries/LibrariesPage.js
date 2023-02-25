import styles from "./LibrariesPage.module.scss";

import Button from 'components/forms/Button/Button';
import EmptyCard from 'components/cards/EmptyCard/EmptyCard';
import LibraryCard from "components/cards/LibraryCard/LibraryCard";

function LibrariesPage({ libraries }) {
    return (
        <div className={styles.librariesContainer}>
            <div className={`${styles.register} card-bg`}>
                <div className={styles.searchContainer}>
                    <label htmlFor="search" className="subheader">SEARCH LIBRARY</label>
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
                    <label htmlFor="version" className="subheader">VERSION</label>
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
                    <label htmlFor="register" className="subheader">REGISTER</label>
                    <Button
                        text="Register Library" 
                        type="primary"
                    />
                </div>
            </div>
            <div className={`${styles.userlibraries} card-bg`}>
                {
                    libraries === undefined || libraries.length === 0 
                    ? <EmptyCard message="Awesome! No vulnerabilities have been detected for your libraries 😊" />
                    : libraries.map((library =>
                        <LibraryCard 
                            {...library}
                        />
                    ))
                }
            </div>
        </div>
    );
}


export default LibrariesPage;