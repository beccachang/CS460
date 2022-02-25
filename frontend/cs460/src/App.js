import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect
} from 'react-router-dom';

import Homepage from './Homepage';
import Loginpage from './Login';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: true,
    };
  }

  login = () => {
      this.setState({isLoggedIn: true}, function() {
        window.history.pushState(null, "New Page Title", "/home");
        window.location.reload();
      });
      
  }

  render() {
    const { isLoggedIn } = this.state;

    return (
        <Router>
          <div>
          <Routes>
            <Route path="/" element={<Loginpage loggedIn={isLoggedIn} login={() => this.login()}/>}/>
            {isLoggedIn ? 
              <Route 
                path="/home"
                element={<Homepage/>}
              /> : null}
            {!isLoggedIn ? 
              <Route 
                path="/home"
                element={<Loginpage/>}
              /> : null}
          </Routes>
          </div>
        </Router>
      );
  }
}

export default App;
