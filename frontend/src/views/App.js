import styles from './App.module.scss';

import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useMsal, useAccount } from "@azure/msal-react";

import NavBar from "components/layouts/navigation/NavBar/NavBar";
import Footer from "components/layouts/navigation/Footer/Footer";
import Landing from "views/Landing/Landing";
import Dashboard from "views/Dashboard/DashboardPage";
import Vulnerabilities from "views/Vulnerabilities/VulnerabilitiesPage";
import Libraries from "views/Libraries/LibrariesPage";
// import VulnerabilityCard from 'components/cards/VulnerabilityCard/VulnerabilityCard';

import dummyData from "assets/dummyData";


function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [data , setData] = useState({});
  const [userLibraries, setLibraries] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const title = {
    "/": isAuthenticated ? "Dashboard" : "Home",
    "/vulnerabilities": "My Vulnerabilities",
    "/libraries": "My Libraries"
  }

  // MSAL
  const { instance, accounts }  = useMsal();
  const account = useAccount(accounts[0] || {});

  // Here we use a useEffect hook with "account" as the dependency.
  // If we retrieve AccountInfo, the user has succesfully signed in using SSO.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      if (account) {
        setAuthenticated(true);
        setUser({
          given_name: account.idTokenClaims.given_name,
          family_name: account.idTokenClaims.family_name,
          email: account.idTokenClaims.email,
          auth_time: account.idTokenClaims.auth_time,
          username: account.idTokenClaims.preferred_username
        })
      }
    }
  }, [account]);

  // Based on the what we retrieve here from this callback function,
  // we set the authentication state.
  const handleLogin = (loggedIn, loggedinUser) => {
    setAuthenticated(loggedIn);
    setUser(loggedinUser);
    getUserData();
  }

  const getUserData = () => {
    if (process.env.NODE_ENV === "production") {
      fetch("api/v1/libraries")
        .then(res => res.json())
        .then(libs => {
          console.log(libs)
          setLibraries(libs);
        });
    } else {
      setData(dummyData);
      setLibraries(dummyData.userLibraries);
    }
  }

  // After the user logs out, we make a fetch request
  // to destroy the user session in the backend.
  const handleLogout = () => {
    if (process.env.NODE_ENV === "production") {
      instance.logoutPopup({
        account: account,
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/"
      }).then(res => {
        fetch('/api/v1/users/logout').catch(e => {
          console.log(e);
        });
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
                <Route path="/" element={ <Dashboard data={data} userLibraries={userLibraries} /> } />
                <Route path="/libraries" element={ <Libraries userLibraries={userLibraries} setUserLibraries={setLibraries} /> } />
                <Route path="/vulnerabilities" element={ <Vulnerabilities data={data} /> } />
              </Routes>
            :
              <Landing handleLogin={handleLogin} msal={instance} />}
          </div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
