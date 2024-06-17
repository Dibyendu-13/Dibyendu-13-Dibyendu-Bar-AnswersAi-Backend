import React, { useState } from 'react';
import axios from 'axios';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import NavBar from './components/NavBar';
import AskQuestion from './components/AskQuestion';
import UserQuestions from './components/UserQuestions';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [userId, setUserId] = useState('');
  const [userProfile, setUserProfile] = useState({});
  const [userQuestions, setUserQuestions] = useState([]);
  const [askedQuestion, setAskedQuestion] = useState('');
  const [appState, setAppState] = useState('register'); // Added state for app state
  const [showQuestions, setShowQuestions] = useState(false);

  const handleRegister = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/users`, {
        email,
        password,
      });
      console.log('User registered:', response.data);
      setAppState('login'); // Move to login page after registration
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
  
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('userId', response.data.id);
  
      console.log(response.data);
      setUserId(response.data.id);
      setAppState('loggedIn'); // Move to logged in state after successful login
      console.log('User logged in:', response.data);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUserId('');
    setAppState('login'); // Move back to login page after logout
    console.log('User logged out');
  };
  

  const handleFetchUserProfile = async (userId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User profile:', response.data);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleFetchUserQuestions = async (userId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/users/${userId}/questions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User questions:', response.data);
      setUserQuestions(response.data);
      setShowQuestions(true);
    } catch (error) {
      console.error('Error fetching user questions:', error);
    }
  };

  const isLoggedIn = appState === 'loggedIn';

  return (
    <div style={{overflow:'hidden'}} className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Ask Me Anything </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {isLoggedIn ? (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={() => handleFetchUserQuestions(userId)}>Get My Questions</button>
                </li>
                <li style={{marginLeft:'900px'}} className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={() => setAppState('register')}>Register</button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={() => setAppState('login')}>Login</button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <div className='mt-4'>
        {appState === 'register' && <UserRegistration API_URL={API_URL} onRegister={handleRegister} />}
        {appState === 'login' && <UserLogin API_URL={API_URL} onLogin={handleLogin} />}
        
        {isLoggedIn && (
          <div className="row">
            <div className="col-md-4">
              {showQuestions && <UserQuestions API_URL={API_URL} userId={userId} questions={userQuestions} />}
              {!showQuestions && <p  className="text-center">Click "Get My Questions" to see your questions.</p>}
            </div>
            <div className="col-md-8">
              <AskQuestion API_URL={API_URL} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
