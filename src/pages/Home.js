import React from 'react';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

import '../css/main.css';

const Home = () => {
  return (
    <div className="page-home">
      <header className="site-header">
        <h1 className="title">Registro de pacientes</h1>
        <SiteNav />
        <Link className="home-button" to="/signin">
          Entrar
        </Link>
      </header>
      <SiteFooter />
    </div>
  );
};

export default Home;
