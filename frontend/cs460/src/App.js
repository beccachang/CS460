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
      userId: null
    };
  }

  login = (username, userId) => {
      this.setState({isLoggedIn: true, username: username, userId: userId});
      
  }

  render() {
    const { isLoggedIn, username, userId } = this.state;
    return (
        <Router>
          <div>
          <Routes>
            {!isLoggedIn ? 
              <Route 
                path="/" 
                element={<Loginpage loggedIn={isLoggedIn} login={(username, userId) => this.login(username, userId)}/>}/> : null}
            {isLoggedIn ? 
              <Route 
                path="/"
                element={<Homepage username={username} userId={userId}/>}
              /> : null} 
          </Routes>
          </div>
        </Router>
      );
  }
}

export default App;
