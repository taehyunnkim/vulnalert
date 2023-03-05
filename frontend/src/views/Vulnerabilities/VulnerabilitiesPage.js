import { useEffect, useState } from "react";

import VulnerabilityCard from "components/cards/VulnerabilityCard/VulnerabilityCard";
import styles from "./VulnerabilitiesPage.module.scss";

import EmptyCard from "components/cards/EmptyCard/EmptyCard";

function VulnerabilitiesPage({ userLibVulnerabilities }) {
    const [showInfo, setShowInfo] = useState(false);
    const [info, setInfo] = useState({});

    const handleClick = (infoData) => {
        if ((infoData.name === info.name && infoData.version === info.version) || !showInfo) {
            setShowInfo(!showInfo);
        }

        setInfo(infoData);
    };

    useEffect(() => {
        if (userLibVulnerabilities !== undefined && userLibVulnerabilities.length > 0) {
            handleClick(userLibVulnerabilities[0]);
        }
    }, []);

    return (
        <div className={styles.vulnerabilitiesContainer}>
            <div className={`${styles.uservulnerabilities}`}>
                <h2 className={styles.header}>Detected Vulnerabilities</h2>
                {
                    userLibVulnerabilities === undefined || userLibVulnerabilities.length === 0 
                    ? <EmptyCard message="Awesome! No vulnerabilities have been detected for your libraries 😊" />
                    : <div className={styles.userVulnerabilitiesContainer}>
                        <div className={styles.vulnHeaders}>
                            <h3 className="subheader">NAME</h3>
                            <h3 className="subheader">VERSION</h3>
                            <h3 className="subheader">SEVERITY</h3>
                        </div>
                        {userLibVulnerabilities.map((vuln =>
                            <VulnerabilityCard 
                                handleClick={handleClick} 
                                key={vuln.name+vuln.version}
                                showDescription={false}
                                active={showInfo && vuln.name === info.name && vuln.version === info.version}
                                {...vuln}
                            />
                        ))}
                    </div>
                }
            </div>
            { showInfo && 
                <div className={`${styles.infoContainer}`}>
                    <h1>{ info && info.libraryName }</h1>
                    <div className={styles.infoBox}>
                        <div>
                            <h2 className="subheader">VERSION</h2>
                            <h3 className={styles.version}>{ info && info.version }</h3>
                        </div>
                        <div>
                            <h2 className="subheader">SEVERITY</h2>
                            <h3 className={info.severity.toLowerCase()}>{ info && info.severity }</h3>
                        </div>
                    </div> 
                    <div className={styles.descriptionBox}>
                        <h2 className="subheader">DESCRIPTION</h2>
                        <p>{ info && info.description }</p>
                    </div>
                    <div className={styles.sourceBox}>
                        <h2 className="subheader">SOURCE</h2>
                        { info && 
                            <div>
                                <h3>{info.sourceName}</h3>
                                <a 
                                    className={styles.source} 
                                    href={info.sourceHref} 
                                    target="_blank" 
                                    rel="noreferrer"
                                >
                                    View Source
                                </a>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}


export default VulnerabilitiesPage;