import styles from './App.module.scss';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError, BrowserAuthError } from "@azure/msal-browser";

import Landing from "views/Landing/Landing";
import Dashboard from "views/Dashboard/DashboardPage";

import dummyData from "assets/dummyData";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [userLibraries, setLibraries] = useState([]);
  const [userLibVulnerabilities, setUserLibVulnerabilities] = useState([]);
  const navigate = useNavigate();

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
        });
        handleLogin();
      } else {
        setAuthenticated(false);
      }
    }
  }, [account]);

  // Periodically check if the user has new vulnerabilities.
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        getUserLibVulnerabilities();
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (process.env.NODE_ENV === "production") {
      if (account) {
        instance.acquireTokenSilent({
            scopes: ["User.Read"],
            account: account
        }).then((response) => {
            const accessToken = response.accessToken;
            fetch('/api/v1/users/ms-login', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then((response) => {
                if (response.ok) {
                  getUserData();
                } else {
                  toast.error("Login failed. Please try again...", 3000);
                }
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log("No refresh token. Please log in...");
        });
      }
    } else {
      setAuthenticated(true);
      setUser({
        given_name: "Alex",
        family_name: "Hunt",
        email: "ahunt@uw.edu",
        auth_time: 1677151382,
        username: "itsalexhunt"
      });
      getUserData();
    }
  }

  const getUserData = () => {
    if (process.env.NODE_ENV === "production") {
      fetch("api/v1/libraries")
        .then(res => res.json())
        .then(libs => {
          setLibraries(libs);
        }).catch(err => console.log(err));

      getUserLibVulnerabilities();
    } else {
      setUserLibVulnerabilities(dummyData.userVulnerabilities);
      setLibraries(dummyData.userLibraries);
    }
  }

  const getUserLibVulnerabilities = () => {
    fetch("api/v1/vulnerabilities")
      .then(res => res.json())
      .then(vulnerabilities => {
        setUserLibVulnerabilities(vulnerabilities);
      }).catch(err => console.log(err));
  }

  // After the user logs out, we make a fetch request
  // to destroy the user session in the backend.
  const handleLogout = () => {
    navigate("/");
    if (process.env.NODE_ENV === "production") {
      instance.logoutRedirect({
        account: account
      }).then(res => {
        fetch('/api/v1/users/logout').catch(e => {
          console.log(e);
        });
      }).catch(e => {
          console.log(e);
          if (e instanceof InteractionRequiredAuthError || (e instanceof BrowserAuthError && e.errorMessage.includes("interaction_in_progress"))) {
            toast.error("Microsoft sign out was incomplete.", 3000);
            toast.info("Please reload the page!", 5000);
          }
      });
    } else {
      setAuthenticated(false);
    }
  }

  const handleUserLibraryUpdate = (updatedLibrary) => {
    setLibraries((prevLibraries) => {
      // update the library with the same name and version
      return prevLibraries.map((library) => {
        if (library.name === updatedLibrary.name && library.version === updatedLibrary.version) {
          return updatedLibrary;
        } else {
          return library;
        }
      });
    });
  }

  return (
    <div className={styles.app}>
      <div className={styles.appContainer}>
        <div className={`${styles.contentContainer}`}>
          
          <div className={`${styles.mainContent}`}>
            { isAuthenticated ? 
              <Routes>
                <Route path="*" element={ 
                  <Dashboard 
                    userLibVulnerabilities={userLibVulnerabilities} 
                    userLibraries={userLibraries}
                    setLibraries={setLibraries}
                    handleUserLibraryUpdate={handleUserLibraryUpdate}
                    getUserLibVulnerabilities={getUserLibVulnerabilities}
                    handleLogout={handleLogout}
                  /> 
                }/>
              </Routes>
              :
              <Landing msal={instance} handleLogin={handleLogin} />
            }
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default App;
