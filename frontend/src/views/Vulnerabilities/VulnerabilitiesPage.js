import { useState } from "react";

import VulnerabilityCard from "components/cards/VulnerabilityCard/VulnerabilityCard";
import styles from "./VulnerabilitiesPage.module.scss";

import EmptyCard from "components/cards/EmptyCard/EmptyCard";

function VulnerabilitiesPage({ data }) {
    const [showInfo, setShowInfo] = useState(false);
    const [info, setInfo] = useState({});

    const handleClick = (infoData) => {
        if (infoData.id === info.id || !showInfo) {
            setShowInfo(!showInfo);
        }

        setInfo(infoData);
    };

    return (
        <div className={styles.vulnerabilitiesContainer}>
            <div className={`${styles.uservulnerabilities} card-bg`}>
                {
                    data.vulnerabilities === undefined || data.vulnerabilities.length === 0 
                    ? <EmptyCard message="Awesome! No vulnerabilities have been detected for your libraries 😊" />
                    : data.vulnerabilities.map((vuln =>
                        <VulnerabilityCard 
                            handleClick={handleClick} 
                            key={vuln.id}
                            showDescription={false}
                            active={showInfo && vuln.id === info.id}
                                {...vuln}
                        />
                    ))
                }
            </div>
            { showInfo && 
                <div className={`${styles.infoContainer} card-bg`}>
                    <p className="subheader">NAME</p>
                    <h1>{ info && info.library }</h1>
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
                        { info && info.source.map(source => {
                            return(
                                <div key={source.name}>
                                    <h3>{source.name}</h3>
                                    <a 
                                        className={styles.source} 
                                        href={source.href} 
                                        target="_blank" 
                                        rel="noreferrer"
                                    >
                                        View Source
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    );
}


export default VulnerabilitiesPage;