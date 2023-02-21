import './App.scss';

import NavBar from "components/layouts/navigation/NavBar/NavBar";
import Footer from "components/layouts/navigation/Footer/Footer";
import Landing from "components/layouts/content/Landing/Landing"

function App() {
  return (
    <div className="app">
        <div className="app-container">
          <NavBar pagename="Home" />
          <div className="content">
            <Landing />
          </div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
