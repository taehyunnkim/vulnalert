import styles from "./DashboardPage.module.scss";

import EmptyCard from "components/cards/EmptyCard/EmptyCard";
import Button from "components/forms/Button/Button";

function DashboardPage(props) {
    // This is how our prop data is going to look like
    const dummyData = {
        userstat: {
            registered: 0,
            vulnerabilities: 0
        },
        userVulnerabilities: [],
        userLibraries: []
    };

    return (
        <div className={styles.dashboardcontainer}>
            <div className={`${styles.stats}`}>
                <div className={`${styles.card} card-bg ${styles.userstat}`}>
                    <h2>Your Summary</h2>
                    <div className={`${styles.userstatContainer}`}>
                        <div className={`${styles.userstatRegistered}`}>
                            <h3>REGISTERED</h3>
                            <p>{dummyData.userstat.registered}</p>
                        </div>
                        <div className={`${styles.userstatVulnerabilities}`}>
                            <h3>VULNERABILITIES</h3>
                            <p>{dummyData.userstat.vulnerabilities}</p>
                        </div>
                    </div>
                </div>
                <div className={`${styles.card} card-bg ${styles.reportstat}`}>
                    <h2>Vulnerability Trends</h2>

                </div>
            </div>
            <div className={`${styles.card} card-bg ${styles.vulnsummaryContainer}`}>
                <h2>Your Vulnerabilities</h2>
                <div className={`${styles.vulnsummary}`}>
                    {dummyData.userLibraries.length === 0 ?
                        <EmptyCard message="You have no vulnerabilities 🥹" /> :
                        <div className={`${styles.vulnsummaryResult}`}>

                        </div>    
                    }
                </div>
                <Button text="View More" type="primary" />
            </div>
            <div className={`${styles.card} card-bg ${styles.libsummaryContainer}`}>
                <h2>Your Libraries</h2>
                <div className={`${styles.libsummary}`}>
                    {dummyData.userLibraries.length === 0 ?
                        <EmptyCard message="It seems like you haven't registered any libraries." /> :
                        <div className={`${styles.libsummaryResult}`}>

                        </div>    
                    }
                </div>
                <Button text="View More" type="primary" />
            </div>
        </div>
    );
}


export default DashboardPage;