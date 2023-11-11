import React, { useEffect, useState } from 'react';
import { setView } from '../reducers/dashReducer.js';
import { useSelector, useDispatch } from 'react-redux';
import { current } from '@reduxjs/toolkit';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler,
} from 'chart.js';
import { setData } from '../reducers/lineReducer.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
);

const lineOptions = {
  scales: {
    y: { ticks: { color: '#black' } },
    x: { ticks: { color: '#black' } },
  },
  responsive: true,
  animation: { duration: 50 },
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

const Metrics = () => {
  const dashboard = useSelector((state) => state.dashboard);
  const lineData = useSelector((state) => state.line);
  const labels = new Array(29).fill('').concat('Now');

  function createDataset(label, dataKey) {
    return {
      labels,
      datasets: [
        {
          label: label,
          data: lineData[dataKey].items,
          fill: false,
          borderColor: 'black',
          tension: 0.2,
          backgroundColor: 'white',
          labelColor: 'black',
        },
      ],
    };
  }

  const bytesIn = createDataset('Bytes In', 'bytesIn');
  const bytesOut = createDataset('Bytes Out', 'bytesOut');
  const cpu = createDataset('CPU Usage %', 'cpu');
  const ram = createDataset('Ram Usage MB', 'ram');
  const totReqPro = createDataset('Total Requests', 'totReqPro');
  const totMsg = createDataset('Total Messages In', 'totMsg');
  const totReqCon = createDataset('Total Requests', 'totReqCon');
  const totFails = createDataset('Total Failed Requests', 'totFails');

  //Switch-Case syntax is used here to toggle between the different cluster viewing options.
  //Each case will render a different series of metrics charts.
  const currentCluster = useSelector((state) => state.dashboard.currentCluster);
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(
        setData({
          bytesIn: Math.floor(Math.random() * 100) + 1,
          bytesOut: Math.floor(Math.random() * 100) + 1,
          cpu: Math.floor(Math.random() * 100) + 1,
          ram: Math.floor(Math.random() * 100) + 1,
          totReqPro: Math.floor(Math.random() * 100) + 1,
          totMsg: Math.floor(Math.random() * 100) + 1,
          totReqCon: Math.floor(Math.random() * 100) + 1,
          totFails: Math.floor(Math.random() * 100) + 1,
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [currentCluster]);
  // if (!currentCluster.length) return;
  // const interval = setInterval(async () => {
  //   try {
  //     const response = await fetch(
  //       `/metrics/metrics?promAddress=${currentCluster}`
  //     );
  //     if (!response.ok) {
  //       throw new Error(`Fetch failed with status ${response.status}`);
  //     }

  //     const metrics = await response.json();
  //     if (typeof metrics === 'object') {
  //       setData(metrics);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching metrics:', error);
  //   }
  // }, 500);

  // return () => clearInterval(interval);
  // }, [currentCluster]);

  switch (dashboard.clusterView) {
    case 'summary':
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
            <Line
              className='lineMetric'
              data={cpu}
              options={lineOptions}
            ></Line>
          </div>
          <div className='lineMetricBox'>
            <Line
              className='lineMetric'
              data={ram}
              options={lineOptions}
            ></Line>
          </div>
        </>
      );
    case 'producers':
      return (
        <>
          <div className='lineMetricBox'>
            <Line
              className='lineMetric'
              data={totReqPro}
              options={lineOptions}
            ></Line>
          </div>
          <div className='lineMetricBox'>
            <Line
              className='lineMetric'
              data={totMsg}
              options={lineOptions}
            ></Line>
          </div>
        </>
      );
    case 'consumers':
      return (
        <>
          <div className='lineMetricBox'>
            <Line
              className='lineMetric'
              data={totReqCon}
              options={lineOptions}
            ></Line>
          </div>
          <div className='lineMetricBox'>
            <Line
              className='lineMetric'
              data={totFails}
              options={lineOptions}
            ></Line>
          </div>
        </>
      );
  }
};

export default Metrics;
