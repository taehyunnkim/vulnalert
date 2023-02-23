import styles from './App.module.scss';

import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"

import NavBar from "components/layouts/navigation/NavBar/NavBar";
import Footer from "components/layouts/navigation/Footer/Footer";
import Landing from "views/Landing/Landing";
import Dashboard from "views/Dashboard/DashboardPage";
import Vulnerabilities from "views/Vulnerabilities/VulnerabilitiesPage";
import Libraries from "views/Libraries/LibrariesPage";
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const { instance }  = useMsal();
  const location = useLocation();
  const navigate = useNavigate();

  const title = {
    "/": isAuthenticated ? "Dashboard" : "Home",
    "/vulnerabilities": "My Vulnerabilities",
    "/libraries": "My Libraries"
  }

  const handleLogin = (loggedIn, loggedinUser) => {
    setAuthenticated(loggedIn);
    setUser(loggedinUser);
  }

  const handleLogout = () => {
    if (process.env.NODE_ENV === "production") {
      instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/"
      }).catch(e => {
          console.log(e);
      });

      setAuthenticated(false);
    } else {
      navigate("/");
      setAuthenticated(false);
    }
  }

  return (
    <div className={styles.app}>
        <div className={styles.appContainer}>
          <div className={`${styles.background}`}>
            <span className={styles.lineLeft}></span>
            <span className={styles.lineMiddle}></span>
            <span className={styles.lineRight}></span>
          </div>
          <div className={styles.content}>
            <NavBar 
              handleLogout={handleLogout}
              title={title[location.pathname]} 
              isAuthenticated={isAuthenticated}
              user={user}
            />
            { isAuthenticated ? 
              <Routes>
                <Route path="/" element={ <Dashboard /> } />
                <Route path="/libraries" element={ <Libraries/> } />
                <Route path="/vulnerabilities" element={ <Vulnerabilities /> } />
              </Routes>
            :
              <Landing handleLogin={handleLogin} />}
          </div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
