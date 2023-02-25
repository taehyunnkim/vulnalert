import styles from "./LibrariesPage.module.scss";

import { useEffect, useState, version } from "react";
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

    const fetchLibraryData = (inputValue) => {
        if (inputValue.length === 0) {
            setLibraries([]);
            return;
        }
        
        if (process.env.NODE_ENV === "production") {
            setLibraryIsLoading(true);
            fetch("api/v1/libraries/searchPrefix/" + inputValue)
                .then(response => response.json())
                .then(data => {
                    data = data.map(name => {
                        return { 
                                value: name,
                                label: name
                            }
                    });
                
                    setLibraries(data);
                    setLibraryIsLoading(false);
                })
                .catch(error => console.error(error));
            setLibraryIsLoading(false);
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

    const debouncedFetchOptions = debounce(fetchLibraryData, 500);

    // useEffect(() => {
    //     if (process.env.NODE_ENV === "production") {
    //         setVersionIsLoading(true);
    //         // get all versions from backend API
    //         setVersionIsLoading(false);
    //     } else {
    //         console.log("importing...")
    //         import("assets/versions").then(versions => {
    //             let data = versions.default.map(name => {
    //                return { 
    //                     value: name,
    //                     label: name
    //                 }
    //             })

    //             setVersions(data);
    //         });
    //     }
    // }, [libraries]);

    const handleInputChange = async (value) => {
        setInputValue(value);
        if (value.length === 0) {
            setLibraryIsLoading(false);
            setLibraries([]);
        } else {
            setLibraryIsLoading(true);
            debouncedFetchOptions(value);
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
        setSelectedLibrary(newLibrary.value);
    };

    const handleVersionSelect = (newVersion) => {
        setSelectedVersion(newVersion.value);
    };

    const handleLibraryBlur = () => {
        console.log("onblur")
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