import './App.scss';

import NavBar from "components/layouts/navigation/NavBar/NavBar"
import Footer from "components/layouts/navigation/Footer/Footer"

function App() {
  return (
    <div className="app">
        <div className="app-container">
          <NavBar pagename="Home" />
          <div className="content">

          </div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
