import styles from "./LibrariesPage.module.scss";

import { toast } from 'react-toastify';
import { useState } from "react";

import EmptyCard from 'components/cards/EmptyCard/EmptyCard';
import LibraryCard from "components/cards/LibraryCard/LibraryCard";
import LibrarySearch from "components/forms/LibrarySearch/LibrarySearch";

function LibrariesPage({ userLibraries, setUserLibraries, handleUserLibraryUpdate, getUserLibVulnerabilities}) {
    const [isBeingAdded, setIsBeingAdded] = useState(false);

    const handleRegister = (selectedLibrary, selectedVersion) => {
        if (!isBeingAdded) {
            setIsBeingAdded(true);
            if (process.env.NODE_ENV === "production") {
                if (selectedLibrary && selectedVersion) {
                    const promise = fetch("api/v1/libraries/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            packageName: selectedLibrary,
                            version: selectedVersion
                        })
                    }).then(res => {
                        if (res.ok) {
                            setUserLibraries([
                                {
                                    name: selectedLibrary,
                                    version: selectedVersion,
                                    alert_enabled: true,
                                    register_date: new Date().toDateString().substring(3)
                                },
                                ...userLibraries
                            ]);

                            getUserLibVulnerabilities();

                            setIsBeingAdded(false);
                        } else {
                            throw new Error("The library is already registered");
                        }
                    }).catch(err => {
                        setIsBeingAdded(false);
                        console.log(err)

                        // Throw a rejected promise for toast
                        throw {};
                    });

                    toast.promise(promise, {
                        pending: "Adding library...",
                        success: "The library was successfully added!",
                        error: "The library is already registered!",
                    }, 2000);
                }
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

                toast.success("The library was successfully added!", 2000);
                setIsBeingAdded(false);
            }   
        }
    }

    return (
        <div className={styles.librariesContainer}>
            <LibrarySearch handleRegister={handleRegister} isDemo={false} type="dashboard" />
            <h2 className={styles.header}>Registered Libraries</h2>
            <div 
                className={`
                    ${styles.userlibraries} 
                    ${userLibraries === undefined || userLibraries.length === 0 ? styles.empty : styles.grid} 
                `}>
                {
                    userLibraries === undefined || userLibraries.length === 0 
                    ? <EmptyCard message="Register new libraries to set up alerts!" />
                    : userLibraries.map((library =>
                        <LibraryCard 
                            key={library.name + library.version}
                            {...library}
                            handleUserLibraryUpdate={handleUserLibraryUpdate}
                        />
                    ))
                }
            </div>
        </div>
    );
}


export default LibrariesPage;