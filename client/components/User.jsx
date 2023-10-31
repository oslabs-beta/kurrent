import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  setAddCluster,
  setClusters,
  setCurrentCluster,
} from '../reducers/dashReducer.js';

const User = () => {
  const dispatch = useDispatch();
  const username = document.cookie.username;
  const clusters = useSelector((state) => state.dashboard.clusters);
  const adding = useSelector((state) => state.dashboard.addingCluster);

  const clusterFetch = async () => {
    const response = await fetch(`/api/users/${username}`);
    if (response.status === 200) {
      const savedPorts = response.json();
      dispatch(setClusters(savedPorts));
    }
  };

  useEffect(() => clusterFetch(), [clusters]);

  const handleFromSubmit = async (e) => {
    e.preventDefault();
    const nickname = e.target.portName.value;
    const number = e.target.portNum.value;
    try {
      const response = await fetch(`/api/users/${username}`, {
        method: 'PATCH',
        body: JSON.stringify({
          nickname,
          number,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201) dispatch(setAddCluster(false));
    } catch (err) {
      console.err('Error during port addition: ', err);
    }
  };

  const clusterButtons = [];
  clusters.forEach((cluster) => {
    clusterButtons.push(
      <>
        <br />
        <button onClick={() => dispatch(setCurrentCluster(cluster))}>
          Port {cluster}
        </button>
      </>
    );
  });

  return (
    <>
      <div id='clusterUserName'>{/* username */} username here</div>
      {!adding && (
        <button id='addCluster' onClick={() => dispatch(setAddCluster(true))}>
          Add a Cluster
        </button>
      )}
      {adding && (
        <form onSubmit={handleFromSubmit}>
          <label>Port Nickname:</label>
          <input
            type='text'
            name='portName'
            className='port'
            placeholder='optional'
            autoComplete='off'
          />
          <br />
          <label>Port Number:</label>
          <input
            type='text'
            name='portNum'
            className='port'
            placeholder='required'
            autoComplete='off'
          />
          <br />
          <button id='add-port' className='button1' type='submit'>
            Add
          </button>
          <button onClick={() => dispatch(setAddCluster(false))}>Cancel</button>
        </form>
      )}
      {clusterButtons}
    </>
  );
};

export default User;
