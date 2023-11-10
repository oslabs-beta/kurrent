import React, { useEffect, useState } from 'react';


import { useSelector } from 'react-redux';





export const summary = () => {
  // const lineData = 
  const lineOptions = {
    scales: {
      y: { ticks: { color: '#black' } },
      x: { ticks: { color: '#black' } },
    },
    responsive: true,
    animation: { duration: 1 },
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    legend: {
      fontColor: 'black',
    },
  };

 
  const currentCluster = useSelector((state) => state.dashboard.currentCluster);
  return (
    <>
      <div className='lineMetricBox'>
        <Line
          className='lineMetric'
          data={bytesIn}
          options={lineOptions}
        ></Line>
      </div>
      <div className='lineMetricBox'>
        <Line
          className='lineMetric'
          data={bytesOut}
          options={lineOptions}
        ></Line>
      </div>
      <div className='lineMetricBox'>
        <Line className='lineMetric' data={cpu} options={lineOptions}></Line>
      </div>
      <div className='lineMetricBox'>
        <Line className='lineMetric' data={ram} options={lineOptions}></Line>
      </div>
    </>
  );
};
export const producers = () => {
  const lineOptions = {
    scales: {
      y: { ticks: { color: '#black' } },
      x: { ticks: { color: '#black' } },
    },
    responsive: true,
    animation: { duration: 1 },
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    legend: {
      fontColor: 'black',
    },
  };

  const currentCluster = useSelector((state) => state.dashboard.currentCluster);
  const [totalReqsPro, setTotalReqsPro] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [totalMsg, setTotalMsg] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  useEffect(() => {
    if (!currentCluster.length) return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/metrics/metrics?promAddress=${currentCluster}`
        );
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }

        const metrics = await response.json();
        if (typeof metrics === 'object') {
          const newTotalReqsPro = metrics.prodReqTotal;
          const newTotalMsg = metrics.prodMessInTotal;
          setTotalReqsPro([...totalReqsPro.slice(1), newTotalReqsPro]);
          setTotalMsg([...totalMsg.slice(1), newTotalMsg]);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentCluster]);
  return (
    <>
      <div className='lineMetricBox'>
        <Line className='lineMetric' data={reqPro} options={lineOptions}></Line>
      </div>
      <div className='lineMetricBox'>
        <Line className='lineMetric' data={msgPro} options={lineOptions}></Line>
      </div>
    </>
  );
};
export const consumers = () => {
  const lineOptions = {
    scales: {
      y: { ticks: { color: '#black' } },
      x: { ticks: { color: '#black' } },
    },
    responsive: true,
    animation: { duration: 1 },
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    legend: {
      fontColor: 'black',
    },
  };

  const currentCluster = useSelector((state) => state.dashboard.currentCluster);
  const [totalReqCons, setTotalReqCons] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [totalFail, setTotalFail] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  useEffect(() => {
    if (!currentCluster.length) return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/metrics/metrics?promAddress=${currentCluster}`
        );
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }

        const metrics = await response.json();
        if (typeof metrics === 'object') {
          const newTotalReqCon = metrics.consReqTot;
          const newTotalFail = metrics.consFailReqTotal;
          setTotalReqCons([...totalReqCons.slice(1), newTotalReqCon]);
          setTotalFail([...totalFail.slice(1), newTotalFail]);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentCluster]);
  return (
    <>
      <div className='lineMetricBox'>
        <Line
          className='lineMetric'
          data={reqCons}
          options={lineOptions}
        ></Line>
      </div>
      <div className='lineMetricBox'>
        <Line className='lineMetric' data={fails} options={lineOptions}></Line>
      </div>
    </>
  );
};
