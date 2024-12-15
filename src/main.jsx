import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, 
  RouterProvider } from 'react-router-dom';
import Home from './page/Home';
import ErrorPage from './page/Error';
import Profile from './page/Profile';
import MoviePage from './page/MoviePage';
import Login from './Login';
import Register from './Register';
import Navbar from './components/Navbar';
import './index.css'
import Category from './page/Category';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <Home />
        </>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: '/Profile',
      element: (
        <>
          <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <Profile />
        </>
      ),
    },
    {
      path: '/MoviePage',
      element: (
        <>
          <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <MoviePage />
        </>
      ),
    },
    {
      path: '/Category',
      element: (
        <>
          <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <Category />
        </>
      ),
    },
    {
      path: '/Login',
      element: <Login onLogin={handleLogin} />,
    },
    {
      path: '/register',
      element: <Register onLogin={handleLogin} />,
    },
  ]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
