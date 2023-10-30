import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  setView,
  setAddCluster,
  setClusters
} from '../reducers/dashReducer.js';

const User = () => {
  const dispatch = useDispatch();
  const username = document.cookie.username;
  const clusters = useSelector((state) => state.dashboard.clusters);

  useEffect(() => {
    async function clusterFetch() {
      const response = await fetch(`/api/users/${username}`);
      if (response.status === 200) {
        const savedPorts = response.json();
        dispatch(setClusters(savedPorts));
      }
    }
    clusterFetch();
  }, [clusters]);

  return (
    <>
      <div>{  /* username */} username here</div>
      <form>
      <input
              type='text'
              className='port'
              placeholder='Add a port'
              autoComplete='off'
              onChange={(e) => dispatch(setAddCluster(e.target.value))}
            />
            <button id='add-port' className='button1' type='submit'> </button>
      </form>
    </>
  );
};

export default User;
