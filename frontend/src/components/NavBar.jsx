import React from 'react';

const NavBar = ({ userId, onLogout }) => {
  return (
    <div>
      <h1>Navbar</h1>
      <p>User ID: {userId}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default NavBar;
