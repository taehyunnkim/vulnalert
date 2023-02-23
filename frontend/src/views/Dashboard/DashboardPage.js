import styles from "./DashboardPage.module.scss";

function DashboardPage(props) {
    const dummyData = {
        userstat: {
            registered: 0,
            vulnerabilities: 0
        }
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
            <div className={`${styles.card} card-bg ${styles.vulnsummary}`}>
                <h2>Your Vulnerabilities</h2>
            </div>
            <div className={`${styles.card} card-bg ${styles.libsummary}`}>
                <h2>Your Libraries</h2>
            </div>
        </div>
    );
}


export default DashboardPage;