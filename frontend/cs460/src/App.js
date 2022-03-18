import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Homepage from './Homepage';
import Loginpage from './Login';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      username: null,
      userId: null,
      continueWithoutLogin: false,
    };
  }

  login = (username, userId) => {
      this.setState({isLoggedIn: true, username: username, userId: userId});
      
  }

  noLogin = () => {
    this.setState({isLoggedIn: true, continueWithoutLogin: true})
  }

  render() {
    const { isLoggedIn, username, userId, continueWithoutLogin } = this.state;
    return (
        <Router>
          <div>
          <Routes>
            {!isLoggedIn ? 
              <Route 
                path="/" 
                element={<Loginpage loggedIn={isLoggedIn} noLogin={this.noLogin} login={(username, userId) => this.login(username, userId)}/>}/> : null}
            {isLoggedIn ? 
              <Route 
                path="/"
                element={<Homepage guest={continueWithoutLogin} username={username} userId={userId}/>}
              /> : null} 
            
          </Routes>
          </div>
        </Router>
      );
  }
}

export default App;
