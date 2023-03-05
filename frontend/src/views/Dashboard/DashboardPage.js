import SummaryPage from "views/Summary/SummaryPage";
import styles from "./DashboardPage.module.scss";

import { Routes, Route, NavLink, Link, Navigate } from "react-router-dom";

import LibrariesPage from "views/Libraries/LibrariesPage";
import VulnerabilitiesPage from "views/Vulnerabilities/VulnerabilitiesPage";
import Button from "components/forms/Button/Button";

function DashboardPage({ trend, setLibraries, userLibraries, userLibVulnerabilities, handleUserLibraryUpdate, getUserLibVulnerabilities, handleLogout }) {
    return (
        <div className={styles.dashboardcontainer}>
            <div className={styles.sideNav}>
                <nav className={`${styles.navHeader}`}>
                    <img className={styles.brandlogo} src="/logo-md.png" alt="Logo"></img>
                    <Link to="/"><h1 className="brandname">Vulnalert</h1></Link>
                    <div className={styles.brandPlaceholder}></div>
                </nav>

                <div className={styles.navContent}>
                    <div className={styles.navItem}>
                        <NavLink to="/">
                            <img className={styles.navIcon} src="assets/icons/stats.svg" alt="Stats Icon"/>
                            <h2>Summary</h2>
                        </NavLink>
                    </div>
                    <div className={styles.navItem}>
                        <NavLink to="/libraries">
                            <img className={styles.navIcon} src="assets/icons/package.svg" alt="Package Icon"/>
                            <h2>Libraries</h2>
                        </NavLink>
                    </div>
                    <div className={styles.navItem}>
                        <NavLink to="/vulnerabilities">
                            <img className={styles.navIcon} src="assets/icons/vulnerability.svg" alt="Vulnerability Icon"/>
                            <h2>Vulnerabilities</h2>
                        </NavLink>
                    </div>
                </div>

                <Button text="Logout" type="warning" onClick={handleLogout} className={styles.button} /> 
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.content}>
                    <Routes>
                        <Route path="/" element={ <SummaryPage userLibVulnerabilities={userLibVulnerabilities} userLibraries={userLibraries} handleUserLibraryUpdate={handleUserLibraryUpdate} trend={trend} /> } />
                        <Route path="/libraries" element={ <LibrariesPage userLibraries={userLibraries} setUserLibraries={setLibraries} handleUserLibraryUpdate={handleUserLibraryUpdate} getUserLibVulnerabilities={getUserLibVulnerabilities} /> } />
                        <Route path="/vulnerabilities" element={ <VulnerabilitiesPage userLibVulnerabilities={userLibVulnerabilities} /> } />
                        <Route path="*" element={ <Navigate to="/" /> } />
                    </Routes>
                </div>
            </div>
        </div>
    );
}


export default DashboardPage;