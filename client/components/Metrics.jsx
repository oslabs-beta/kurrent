import React, { useEffect, useState } from 'react';
import { setView } from '../reducers/dashReducer.js';
import { useSelector } from 'react-redux';
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

const Metrics = () => {
  const dashboard = useSelector((state) => state.dashboard);
  const lineData = useSelector((state) => state.line);
  const labels = [
    '-15s',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Now',
  ];
  const bytesIn = {
    labels,
    datasets: [
      {
        label: 'Bytes In',
        data: lineData.bytesIn.queue,
        fill: false,
        borderColor: 'black',
        backgroundColor: 'white',
        tension: 0.4,
        labelColor: 'black',
      },
    ],
  };
  const bytesOut = {
    labels,
    datasets: [
      {
        label: 'Bytes Out',
        data: lineData.bytesOut.queue,
        fill: false,
        borderColor: 'black',
        tension: 0.4,
        backgroundColor: 'white',
        labelColor: 'black',
      },
    ],
  };
  const cpu = {
    labels,
    datasets: [
      {
        label: 'CPU Usage %',
        data: lineData.cpu.queue,
        fill: false,
        borderColor: 'black',
        tension: 0.4,
        backgroundColor: 'white',
        labelColor: 'black',
      },
    ],
  };
  const ram = {
    labels,
    datasets: [
      {
        label: 'Ram Usage MB',
        data: lineData.ram.queue,
        fill: false,
        borderColor: 'black',
        tension: 0.4,
        backgroundColor: 'white',
        labelColor: 'black',
      },
    ],
  };
  const reqPro = {
    labels,
    datasets: [
      {
        label: 'Total Requests',
        data: lineData.totReqPro.queue,
        fill: false,
        borderColor: 'black',
        tension: 0.4,
        backgroundColor: 'white',
        labelColor: 'black',
      },
    ],
  };
  const msgPro = {
    labels,
    datasets: [
      {
        label: 'Total Messages In',
        data: lineData.totMsg.queue,
        fill: false,
        borderColor: 'black',
        tension: 0.4,
        backgroundColor: 'white',
        labelColor: 'black',
      },
    ],
  };
  const reqCons = {
    labels,
    datasets: [
      {
        label: 'Total Requests',
        data: lineData.totReqCon.queue,
        fill: false,
        borderColor: 'black',
        tension: 0.4,
        backgroundColor: 'white',
        labelColor: 'black',
      },
    ],
  };
  const fails = {
    labels,
    datasets: [
      {
        label: 'Total Failed Requests',
        data: lineData.totFails.queue,
        fill: false,
        borderColor: 'black',
        tension: 0.4,
        backgroundColor: 'white',
        labelColor: 'black',
      },
    ],
  };

  //Switch-Case syntax is used here to toggle between the different cluster viewing options.
  //Each case will render a different series of metrics charts.
  const currentCluster = useSelector((state) => state.dashboard.currentCluster);
  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        bytesIn: Math.floor(Math.random() * 100) + 1,
        bytesOut: Math.floor(Math.random() * 100) + 1,
        cpu: Math.floor(Math.random() * 100) + 1,
        ram: Math.floor(Math.random() * 100) + 1,
      });
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
              data={reqPro}
              options={lineOptions}
            ></Line>
          </div>
          <div className='lineMetricBox'>
            <Line
              className='lineMetric'
              data={msgPro}
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
              data={reqCons}
              options={lineOptions}
            ></Line>
          </div>
          <div className='lineMetricBox'>
            <Line
              className='lineMetric'
              data={fails}
              options={lineOptions}
            ></Line>
          </div>
        </>
      );
  }
};

export default Metrics;
