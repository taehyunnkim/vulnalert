import styles from "./LibrariesPage.module.scss";

import { useEffect, useState } from "react";
import Select from 'react-select'

import Button from 'components/forms/Button/Button';
import EmptyCard from 'components/cards/EmptyCard/EmptyCard';
import LibraryCard from "components/cards/LibraryCard/LibraryCard";

function LibrariesPage({ userLibraries, setUserLibraries }) {
    const [libraries, setLibraries] = useState([]);
    const [versions, setVersions] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState("");
    const [selectedVersion, setSelectedVersion] = useState("");

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            outline: "none",
            boxShadow: state.isFocused ? "rgba(50, 50, 93, 0.20) 0px 2px 3px -1px, rgba(0, 0, 0, 0.25) 0px 1px 3px -1px" : "none",
            border: state.isFocused ? "1px solid #4429E9" : "1px solid #919EAB",
            '&:hover': {
                borderColor: "#4429E9",
            },
            cursor: "pointer",
            backgroundColor: state.isFocused ? "white" : "#F4F6F9",
            fontSize: "3.2rem"
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: "1.4rem",
            backgroundColor: state.isSelected ? "#4429E9" : "white",
        }),
        singleValue: (provided, state) => ({
            ...provided,
        }),
    };

    useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            // get all versions from backend API
        } else {
            import("assets/names").then(names => {
                let data = names.default.map(name => {
                   return { 
                        value: name,
                        label: name
                    }
                })

                setLibraries(data);
            });
        }
    }, []);

    useEffect(() => {
        if (process.env.NODE_ENV === "production") {
            // get all libraries from backend API
        } else {
            import("assets/versions").then(versions => {
                let data = versions.default.map(name => {
                   return { 
                        value: name,
                        label: name
                    }
                })

                setVersions(data);
            });
        }
    }, [libraries]);

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

    return (
        <div className={styles.librariesContainer}>
            <div className={`${styles.register} card-bg`}>
                <div className={styles.searchContainer}>
                    <label htmlFor="search" className="subheader">SEARCH LIBRARY</label>
                    <div className={styles.searchInputContainer}>
                        <Select 
                            options={libraries} 
                            styles={customStyles}
                            placeholder="Search for a library..."
                            onChange={handleLibrarySelect}
                        />
                    </div>
                </div>
                <div className={styles.versionContainer}>
                    <label htmlFor="version" className="subheader">VERSION</label>
                    <Select 
                        options={versions} 
                        styles={customStyles}
                        placeholder="Search version..."
                        onChange={handleVersionSelect}
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