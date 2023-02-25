import styles from "./DashboardPage.module.scss";

import { ResponsiveLine } from '@nivo/line'
import { useNavigate } from "react-router-dom";

import EmptyCard from "components/cards/EmptyCard/EmptyCard";
import Button from "components/forms/Button/Button";
import VulnerabilityCard from "components/cards/VulnerabilityCard/VulnerabilityCard";
import LibraryCard from "components/cards/LibraryCard/LibraryCard";

function DashboardPage({ data, userLibraries }) {
    const navigate = useNavigate()

    return (
        <div className={styles.dashboardcontainer}>
            <div className={`${styles.stats}`}>
                <div className={`${styles.card} card-bg ${styles.userstat}`}>
                    <h2>Your Summary</h2>
                    <div className={`${styles.userstatContainer}`}>
                        <div className={`${styles.userstatRegistered}`}>
                            <h3 className="subheader">REGISTERED</h3>
                            <p className={`${styles.statNumber}`}>
                                {
                                    userLibraries.length
                                }
                            </p>
                        </div>
                        <div className={`${styles.userstatVulnerabilities}`}>
                            <h3 className="subheader">VULNERABILITIES</h3>
                            <p className={`${styles.statNumber}`}>
                                {
                                    data.userVulnerabilities ? data.userVulnerabilities.length : 0
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`${styles.card} card-bg ${styles.reportstat}`}>
                    <h2>Vulnerability Trends</h2>
                    <div className={`${styles.chart}`}>
                        <ResponsiveLine 
                            data={data.trend ? data.trend : [{id:0, data:[{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}]}]}
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
            </div>
            <div className={`${styles.card} card-bg ${styles.vulnsummaryContainer}`}>
                <h2>Your Vulnerabilities</h2>
                <div className={`${styles.vulnsummary}`}>
                    {
                        data.userVulnerabilities === undefined || data.userVulnerabilities.length === 0
                        ? <EmptyCard message="No vulnerabilities have been detected for your libraries 😊" />
                        : <div className={styles.userVulnerabilitiesContainer}>
                            <div className={styles.vulnHeaders}>
                                <h3 className="subheader">NAME</h3>
                                <h3 className="subheader">VERSION</h3>
                                <h3 className="subheader">SEVERITY</h3>
                                <h3 className="subheader">DESCRIPTION</h3>
                            </div>
                            {data.userVulnerabilities.slice(0, 2).map((vuln =>
                                <VulnerabilityCard  
                                    key={vuln.id}
                                    showDescription={true}
                                    {...vuln}
                                />
                            ))}
                        </div>
                    }
                </div>
                <Button 
                    text="View Vulnerabilities" 
                    type="primary"
                    onClick={() => {
                        navigate("vulnerabilities")
                    }}
                />
            </div>
            <div className={`${styles.card} card-bg ${styles.libsummaryContainer}`}>
                <h2>Your Libraries</h2>
                {
                    data.userLibraries === undefined || data.userLibraries.length === 0
                    ? <EmptyCard message="It seems like you haven't registered any libraries." />
                    : <div className={styles.libsummaryResult}>
                        {data.userLibraries.slice(0, 3).map((lib =>
                            <LibraryCard  
                                key={lib.name}
                                {...lib}
                            />
                        ))}
                    </div>    
                }
                <Button 
                    text="View Libraries" 
                    type="primary"
                    onClick={() => {
                        navigate("libraries")
                    }}
                />
            </div>
        </div>
    );
}


export default DashboardPage;