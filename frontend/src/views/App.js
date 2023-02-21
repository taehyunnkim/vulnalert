import './App.scss';

import NavBar from "components/layouts/navigation/NavBar/NavBar"

function App() {
  return (
    <div className="app">
        <div className="app-container">
          <NavBar pagename="Home" />
        </div>
    </div>
  );
}

export default App;
