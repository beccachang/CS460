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
      isLoggedIn: false,
      username: null,
      userID: null
    };
  }

  login = (username, userID) => {
      // VIVIEN: I added userID to the state because it is needed in so many calls
      this.setState({isLoggedIn: true, username: username, userID: userID}, function() {
        window.history.pushState(null, "New Page Title", "/home");
      });
  }

  render() {
    const { isLoggedIn, username, userID } = this.state;

    return (
        <Router>
          <div>
          <Routes>
            <Route path="/" element={<Loginpage loggedIn={isLoggedIn} login={(username, userID) => this.login(username, userID)}/>}/>
            {isLoggedIn ? 
              <Route 
                path="/home"
                element={<Homepage username={username} userID={userID}/>}
              /> : null}
            {!isLoggedIn ? 
              <Route 
                path="/home"
                element={<Loginpage login={this.login}/>}
              /> : null}
          </Routes>
          </div>
        </Router>
      );
  }
}

export default App;
