import './App.scss';

import NavBar from "components/layouts/navigation/NavBar/NavBar";
import Footer from "components/layouts/navigation/Footer/Footer";
import Landing from "views/Landing/Landing";
import Dashboard from "views/Dashboard/DashboardPage";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

function App() {
  return (
    <div className="app">
        <div className="app-container">
          <div className="content">
            <AuthenticatedTemplate>
              <NavBar pagename="Dashboard" />
              <Dashboard />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <NavBar pagename="Home" />
              <Landing />
            </UnauthenticatedTemplate>
          </div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
