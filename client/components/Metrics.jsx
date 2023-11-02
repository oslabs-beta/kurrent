import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler,
} from 'chart.js';

import { Bar, Chart, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
);

import { setView } from '../reducers/dashReducer.js';
import { useSelector } from 'react-redux';

const Metrics = () => {
  const [labels, setLabels] = useState([
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
    '',
    '',
    'Now',
  ]);

  const [bytesInData, setBytesInData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [bytesOutData, setBytesOutData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [cpuValue, setCpuValue] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [ramValue, setRamValue] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
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
  const currentCluster = useSelector((state) => state.dashboard.currentCluster);
  useEffect(() => {
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
          const newBytesInValue = metrics.bytesIn / 1000 || 0;
          const newBytesOutValue = metrics.bytesOut / 1000 || 0;
          const newCpuValue = metrics.cpu;
          const newRamValue = metrics.ramUsage / 1000000 || 0;
          const newTotalReqsPro = metrics.prodReqTotal;
          const newTotalMsg = metrics.prodMessInTotal;
          const newTotalReqCon = metrics.consReqTot;
          const newTotalFail = metrics.consFailReqTotal;

          setBytesInData([...bytesInData.slice(1), newBytesInValue]);
          setBytesOutData([...bytesOutData.slice(1), newBytesOutValue]);
          setCpuValue([...cpuValue.slice(1), newCpuValue]);
          setRamValue([...ramValue.slice(1), newRamValue]);
          setTotalReqsPro([...totalReqsPro.slice(1), newTotalReqsPro]);
          setTotalMsg([...totalMsg.slice(1), newTotalMsg]);
          setTotalReqCons([...totalReqCons.slice(1), newTotalReqCon]);
          setTotalFail([...totalFail.slice(1), newTotalFail]);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }, 500);

    return () => clearInterval(interval);
  });

  const bytesIn = {
    labels,
    datasets: [
      {
        label: 'Bytes In',
        data: bytesInData,
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
        data: bytesOutData,
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
        data: cpuValue,
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
        data: ramValue,
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
        data: totalReqsPro,
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
        data: totalMsg,
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
        data: totalReqCons,
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
        data: totalFail,
        fill: false,
        borderColor: 'black',
        tension: 0.4,
        backgroundColor: 'white',
        labelColor: 'black',
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: { ticks: { color: '#black' } },
      x: { ticks: { color: '#black' } },
    },
    responsive: true,
    animation: { duration: 100 },
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

  const dashboard = useSelector((state) => state.dashboard);

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
