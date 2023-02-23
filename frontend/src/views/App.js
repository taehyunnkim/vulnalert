import './App.scss';

import { useState, useEffect } from "react";
import NavBar from "components/layouts/navigation/NavBar/NavBar";
import Footer from "components/layouts/navigation/Footer/Footer";
import Landing from "views/Landing/Landing";
import Dashboard from "views/Dashboard/DashboardPage";
import { useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const { instance }  = useMsal();

  const handleLogin = (loggedIn) => {
    setAuthenticated(loggedIn);
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
      setAuthenticated(false);
    }
  }

  return (
    <div className="app">
        <div className="app-container">
          <div className="content">
            <NavBar 
              handleLogout={handleLogout}
              pagename={isAuthenticated ? "Dashboard" : "Home"} 
              isAuthenticated={isAuthenticated} 
            />
            { isAuthenticated ? <Dashboard /> : <Landing handleLogin={handleLogin} />}
          </div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
