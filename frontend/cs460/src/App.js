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
      username: null,
    };
  }

  login = (username) => {
      this.setState({isLoggedIn: true, username: username}, function() {
        window.history.pushState(null, "New Page Title", "/home");
        window.location.reload();
      });
      
  }

  render() {
    const { isLoggedIn, username } = this.state;

    return (
        <Router>
          <div>
          <Routes>
            <Route path="/" element={<Loginpage loggedIn={isLoggedIn} login={username => this.login(username)}/>}/>
            {isLoggedIn ? 
              <Route 
                path="/home"
                element={<Homepage username={username}/>}
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
