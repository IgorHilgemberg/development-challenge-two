import React from 'react';
import { Link } from 'react-router-dom';

const PageList = () => {
    const pages = [
        { url: '/', title: 'Home' },
        { url: '/register', title: 'Cadastrar' }
    ];

    return (
      <ul>
        {
          pages.map((v, i) => (
            <li key={i}><Link to={v.url}>{v.title}</Link></li>
          ))
        }
      </ul>
    );
};

export default PageList;
