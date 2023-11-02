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
  const username = useSelector((state) => state.login.username);
  const clusters = useSelector((state) => state.dashboard.clusters);
  const adding = useSelector((state) => state.dashboard.addingCluster);

  // useEffect(() => {
  //   const clusterFetch = async () => {
  //     const response = await fetch(`/users/service-address${username}`);
  //     if (response.status === 200) {
  //       const savedPorts = await response.json();
  //       console.log(savedPorts);
  //       dispatch(setClusters(savedPorts));
  //     }
  //   };
  //   clusterFetch();
  // }, []);

  const handleFromSubmit = async (e) => {
    e.preventDefault();
    const nickname = e.target.portName.value;
    const service_addresses = e.target.portNum.value;
    try {
      const response = await fetch(`/users/update-service-addresses${username}`, {
        method: 'PATCH',
        body: JSON.stringify({
          nickname,
          service_addresses,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        dispatch(setAddCluster(false));
        dispatch(setClusters([...clusters, service_addresses]))
      }
    } catch (err) {
      console.err('Error during port addition: ', err);
    }
  };

  const clusterButtons = [];
  if (Array.isArray(clusters)){
    clusters.forEach((cluster, idx) => {
      clusterButtons.push(
        <>
          <br />
          <button onClick={() => dispatch(setCurrentCluster(cluster))} key={`port${idx}`}>
            Port {cluster}
          </button>
        </>
      );
    });}

  return (
    <>
      <div id='clusterUserName'>{`${username}'s Cluster`}</div>
      {!adding && (
        <button id='addCluster' onClick={() => dispatch(setAddCluster(true))}>
          Add a Cluster
        </button>
      )}
      {adding && (
        <form className='addPortForm' onSubmit={handleFromSubmit}>
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
          <button id='cancel-port' onClick={() => dispatch(setAddCluster(false))}>Cancel</button>
        </form>
      )}
      {clusterButtons}
    </>
  );
};

export default User;
