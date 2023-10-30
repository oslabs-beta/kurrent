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
  const adding = useSelector((state) => state.dashboard.addingCluster)

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
      {!adding && <button onClick={() => dispatch(setAddCluster(true))}>Add a Cluster</button>}
      {adding && <form>
        <input
          type='text'
          name='portName'
          className='port'
          placeholder='Port Nickname'
          autoComplete='off'
          />
        <br />
        <input type='text'
          name='portNum'
          className='port'
          placeholder='Port Number'
          autoComplete='off'/>
        <br />
        <button id='add-port' className='button1' type='submit'>Add</button>
      </form>}
    </>
  );
};

export default User;
