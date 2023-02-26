import styles from "./LibrariesPage.module.scss";

import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { debounce } from "lodash";

import Button from 'components/forms/Button/Button';
import EmptyCard from 'components/cards/EmptyCard/EmptyCard';
import LibraryCard from "components/cards/LibraryCard/LibraryCard";
import customStyles from "./LibrariesInputStyles";

function LibrariesPage({ userLibraries, setUserLibraries }) {
    const [libraries, setLibraries] = useState([]);
    const [libraryIsLoading, setLibraryIsLoading] = useState(false);
    const [versionIsLoading, setVersionIsLoading] = useState(false);
    const [versions, setVersions] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState("");
    const [selectedVersion, setSelectedVersion] = useState("");
    const [inputValue, setInputValue] = useState("");

    const debouncedFetchOptionsRef = useRef(null);

    useEffect(() => {
        debouncedFetchOptionsRef.current = debounce(fetchLibraryData, 1000);

        return () => {
            debouncedFetchOptionsRef.current.cancel();
        };
    }, []);

    const fetchLibraryData = (inputValue) => {
        if (inputValue.length === 0) {
            setLibraries([]);
            return;
        }
        
        if (process.env.NODE_ENV === "production") {
            setLibraryIsLoading(true);
            fetch("api/v1/libraries/" + inputValue)
                .then(response => response.json())
                .then(data => {
                    setLibraries(data);
                    setLibraryIsLoading(false);
                }).catch(error => console.error(error));
        } else {
            import("assets/names")
            .then(names => {
                let data = names.default;
                data = data.filter(name => {
                    return name.substring(0, inputValue.length) === inputValue;
                }).map(name => {
                    return { 
                            value: name,
                            label: name
                    }
                });
                
                setLibraries(data);
                setLibraryIsLoading(false);
            });
        }
    };

    const handleInputChange = async (value) => {
        setInputValue(value);
        if (value.length === 0) {
            setLibraryIsLoading(false);
            setLibraries([]);
        } else {
            setLibraryIsLoading(true);
            debouncedFetchOptionsRef.current.cancel();
            debouncedFetchOptionsRef.current(value);
        }
    };

    const handleRegister = () => {
        if (process.env.NODE_ENV === "production") {
            // call the backend API for registration
        } else {
            setUserLibraries([
                {
                    name: selectedLibrary,
                    version: selectedVersion,
                    alert_enabled: true,
                    register_date: new Date().toDateString().substring(3)
                },
                ...userLibraries
            ]);
        }
    }

    const handleLibrarySelect = (newLibrary) => {
        setSelectedLibrary(newLibrary.name);
    };

    const handleVersionSelect = (newVersion) => {
        setSelectedVersion(newVersion.name);
    };

    const handleLibraryBlur = () => {
        setLibraryIsLoading(false);
      };

    return (
        <div className={styles.librariesContainer}>
            <div className={`${styles.register} card-bg`}>
                <div className={styles.searchContainer}>
                    <label htmlFor="search" className="subheader">SEARCH LIBRARY</label>
                    <div className={styles.searchInputContainer}>
                        <Select 
                            options={libraries} 
                            styles={customStyles}
                            isLoading={libraryIsLoading}
                            placeholder="Search for a library..."
                            onChange={handleLibrarySelect}
                            onInputChange={handleInputChange}
                            inputValue={inputValue}
                            onBlur={handleLibraryBlur}
                            menuIsOpen={libraries.length > 0}
                            key={JSON.stringify(libraries)}
                        />
                    </div>
                </div>
                <div className={styles.versionContainer}>
                    <label htmlFor="version" className="subheader">VERSION</label>
                    <Select 
                        isLoading={versionIsLoading}
                        options={versions} 
                        styles={customStyles}
                        placeholder="Search version..."
                        onChange={handleVersionSelect}
                        isDisabled={selectedLibrary.length === 0}
                    />
                </div>
                <div className={styles.submitContainer}>
                    <label htmlFor="register" className="subheader">REGISTER</label>
                    <Button
                        text="Register Library" 
                        type="primary"
                        onClick={handleRegister}
                    />
                </div>
            </div>
            <div 
                className={`
                    ${styles.userlibraries} 
                    ${userLibraries === undefined || userLibraries.length === 0 ? styles.empty : styles.grid} 
                `}>
                {
                    userLibraries === undefined || userLibraries.length === 0 
                    ? <EmptyCard message="Regiser new libraries to set up alerts!" />
                    : userLibraries.map((library =>
                        <LibraryCard 
                            key={library.name}
                            {...library}
                        />
                    ))
                }
            </div>
        </div>
    );
}


export default LibrariesPage;