import styles from "./SummaryPage.module.scss";

import { ResponsiveLine } from '@nivo/line'
import { useNavigate } from "react-router-dom";

import EmptyCard from "components/cards/EmptyCard/EmptyCard";
import Button from "components/forms/Button/Button";
import VulnerabilityCard from "components/cards/VulnerabilityCard/VulnerabilityCard";
import LibraryCard from "components/cards/LibraryCard/LibraryCard";

function SummaryPage({ trend, userLibraries, userLibVulnerabilities, handleUserLibraryUpdate }) {
    const navigate = useNavigate()
    return (
        <div className={styles.summaryContainer}>
            <div className={`${styles.stats}`}>
                <div className={`${styles.userstat}`}>
                    <h2 className={styles.header}>Your Summary</h2>
                    <div className={`${styles.userstatContainer}`}>
                        <div className={`${styles.userstatRegistered}`}>
                            <h3 className="subheader">REGISTERED</h3>
                            <p className={`${styles.statNumber}`}>
                                { userLibraries.length }
                            </p>
                        </div>
                        <div className={`${styles.userstatVulnerabilities}`}>
                            <h3 className="subheader">VULNERABILITIES</h3>
                            <p className={`${styles.statNumber}`}>
                                { userLibVulnerabilities.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.reportstat}`}>
                <h2>Vulnerability Trends</h2>
                <div className={`${styles.chart}`}>
                    <ResponsiveLine 
                        data={trend ? trend : [{id:0, data:[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}]}]}
                        margin={{ top: 14, right: 20, bottom: 20, left: 20 }}
                        xScale={{ type: 'point' }}
                        yScale={{
                            type: 'linear',
                            min: '0',
                            max: 'auto',
                            stacked: true,
                            reverse: false
                        }}
                        axisLeft={null}
                        colors={{ scheme: 'category10' }}
                        curve="catmullRom"
                        useMesh={true}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        enableArea={true}
                        areaBaselineValue={0}
                    />
                </div>
            </div>
            <div className={styles.userDataSummaryContainer}>
                <div className={`${styles.libsummaryContainer} ${styles.card} card-bg`}>
                    <h2 className={styles.header}>Your Libraries</h2>
                    {
                        userLibraries === undefined || userLibraries.length === 0
                        ? <EmptyCard message="It seems like you haven't registered any libraries." />
                        : <div className={styles.libsummaryResult}>
                            {userLibraries.slice(0,2).map((lib =>
                                <LibraryCard  
                                    key={lib.name}
                                    {...lib}
                                    handleUserLibraryUpdate={handleUserLibraryUpdate}
                                />
                            ))}
                        </div>    
                    }
                    <Button 
                        text="View Libraries" 
                        type="dashboard"
                        onClick={() => {
                            navigate("libraries")
                        }}
                    />
                </div>
                <div className={`${styles.vulnsummaryContainer} ${styles.card} card-bg`}>
                    <h2 className={styles.header}>Your Vulnerabilities</h2>
                    <div className={`${styles.vulnsummary}`}>
                        {
                            userLibVulnerabilities === undefined || userLibVulnerabilities.length === 0
                            ? <EmptyCard message="No vulnerabilities have been detected for your libraries 😊" />
                            : <div className={styles.userVulnerabilitiesContainer}>
                                <div className={styles.vulnHeaders}>
                                    <h3 className="subheader">NAME</h3>
                                    <h3 className="subheader">VERSION</h3>
                                    <h3 className="subheader">SEVERITY</h3>
                                </div>
                                {userLibVulnerabilities.slice(0, 2).map((vuln =>
                                    <VulnerabilityCard  
                                        key={vuln.name}
                                        showDescription={false}
                                        {...vuln}
                                    />
                                ))}
                            </div>
                        }
                    </div>
                    <Button 
                        text="View Vulnerabilities" 
                        type="dashboard"
                        onClick={() => {
                            navigate("vulnerabilities")
                        }}
                    />
                </div>
            </div>
        </div>
    );
}


export default SummaryPage;