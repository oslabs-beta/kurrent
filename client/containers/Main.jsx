import React, { useEffect, useState } from 'react';
import useNavigate from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Write from '../components/Write.jsx';
import Read from '../components/Read.jsx';
import Cpu from '../components/Cpu.jsx';
import Memory from '../components/Memory.jsx';
import User from '../components/User.jsx';

import '../scss/main.scss';

const Main = () => {
  return (
    <>
      <h1>Kurrent</h1>
      <nav>
        <form action='' className='portForm'>
          <input type='text' placeholder='Enter Port' />
          <button>Sign Out</button>
        </form>
      </nav>
      <div className='userInfo'>
        <User />
      </div>
      <div className='metrics'>
        <Write />
        <Read />
        <Cpu />
        <Memory />
      </div>
    </>
  );
};

export default Main;
