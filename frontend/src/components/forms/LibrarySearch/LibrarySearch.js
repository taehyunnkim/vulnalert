import styles from "./LibrarySearch.module.scss";

import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { debounce } from "lodash";

import Button from 'components/forms/Button/Button';
import customStyles from "./LibrariesInputStyles";

function LibrarySearch(props) {
    const [libraries, setLibraries] = useState([]);
    const [libraryIsLoading, setLibraryIsLoading] = useState(false);
    const [versionIsLoading, setVersionIsLoading] = useState(false);
    const [versions, setVersions] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState("");
    const [selectedVersion, setSelectedVersion] = useState("");

    const debouncedFetchOptionsRef = useRef(null);

    useEffect(() => {
        debouncedFetchOptionsRef.current = debounce(fetchLibraryData, 1000);

        return () => {
            debouncedFetchOptionsRef.current.cancel();
        };
    }, []);

    const fetchLibraryData = (inputValue) => {        
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
                        label: name,
                        id: name
                    }
                });
                
                setLibraries(data);
                setLibraryIsLoading(false);
            });
        }
    };

    const handleInputChange = (value) => {
        if (value.length === 0) {
            setLibraryIsLoading(false);
            setSelectedVersion("");
        } else {
            setLibraryIsLoading(true);
            debouncedFetchOptionsRef.current.cancel();
            debouncedFetchOptionsRef.current(value);
        }
    };

    const handleLibrarySelect = (newLibrary) => {
        setSelectedLibrary(newLibrary.value);

        setVersions([]);
        setSelectedVersion("");
        setVersionIsLoading(true);

        fetch("api/v1/libraries/versions/" + newLibrary.value)
            .then(response => response.json())
            .then(data => {
                setVersions(data.map(version => {
                    return {
                        value: version,
                        label: version,
                        id: version
                    }
                }));
                setVersionIsLoading(false);
            }).catch(error => {
                setVersionIsLoading(false);
                console.error(error)    
            });
    };

    const handleVersionSelect = (newVersion) => {
        setSelectedVersion(newVersion.value);
    };

    const handleLibraryBlur = () => {
        setLibraryIsLoading(false);
    };

    return (
        <div className={`${styles.register} ${props.isDemo ? "card-bg" : ""} ${props.isDemo ? styles.padded : ""}`}>
            <div className={styles.searchContainer}>
                { props.isDemo ? <label htmlFor="search" className="subheader">LIBRARY</label> : <label htmlFor="search" className="subheader">SEARCH LIBRARY</label> }
                <div className={styles.searchInputContainer}>
                    {props.isDemo ?
                        <Select 
                            inputValue="node"
                            styles={customStyles}
                            onInputChange={""}
                            components={{
                                Menu: () => null,
                                MenuList: () => null,
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null
                            }}
                        />
                        :
                        <Select 
                            options={libraries} 
                            styles={customStyles}
                            isLoading={libraryIsLoading}
                            placeholder="Search for a library..."
                            onChange={handleLibrarySelect}
                            onInputChange={handleInputChange}
                            onBlur={handleLibraryBlur}
                        />
                    }

                </div>
            </div>
            <div className={styles.versionContainer}>
                <label htmlFor="version" className="subheader">VERSION</label>
                { props.isDemo ?
                    <Select 
                        inputValue="14.15.0"
                        styles={customStyles}
                        components={{
                            Menu: () => null,
                            MenuList: () => null,
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null
                        }}
                    />
                    :
                    <Select
                        isLoading={versionIsLoading}
                        options={versions} 
                        styles={customStyles}
                        placeholder="Search version..."
                        onChange={handleVersionSelect}
                        isDisabled={selectedLibrary.length === 0 || versionIsLoading}
                        key={selectedLibrary}
                    />
                }

            </div>
            {props.isDemo ?
                ""
                : 
                <div className={styles.submitContainer}>
                    <label htmlFor="register" className="subheader">.</label>
                    <Button
                        text="Register Library" 
                        type="dashboard"
                        onClick={() => props.handleRegister(selectedLibrary, selectedVersion)}
                    />
                </div>
            }
        </div>
    );
}


export default LibrarySearch;