import logo from './logo.svg';
import './App.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Homepage from './Homepage';
import Loginpage from './Login';

function App() {
  var isLoggedIn = true;

  const login = function () {
    isLoggedIn = true;
  }

  return (
    <Router>
      <div>
      <Routes>
        <Route path="/" element={<Loginpage />}/>
        <Route 
          path="/home"
          element={isLoggedIn ? <Homepage/> : <Loginpage/>}
        />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
