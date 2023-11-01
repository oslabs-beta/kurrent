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
    '-30s',
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newBytesInValue = Math.floor(Math.random() * 100);
  //     const newBytesOutValue = Math.floor(Math.random() * 100);
  //     const newCpuValue = Math.floor(Math.random() * 100);
  //     const newRamValue = Math.floor(Math.random() * 100);
  //     setBytesInData([...bytesInData.slice(1), newBytesInValue]);
  //     setBytesOutData([...bytesOutData.slice(1), newBytesOutValue]);
  //     setCpuValue([...cpuValue.slice(1), newCpuValue]);
  //     setRamValue([...ramValue.slice(1), newRamValue]);
  //   }, 500);
  //   return () => clearInterval(interval);
  // });

  const bytesIn = {
    labels,
    datasets: [
      {
        label: 'Bytes In',
        data: bytesInData,
        fill: false,
        borderColor: 'white',
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
        fill: true,
        borderColor: 'white',
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
        label: 'CPU Usage',
        data: cpuValue,
        fill: true,
        borderColor: 'white',
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
        label: 'Ram Usage',
        data: ramValue,
        fill: true,
        borderColor: 'white',
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
        fill: true,
        borderColor: 'white',
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
        fill: true,
        borderColor: 'white',
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
        fill: true,
        borderColor: 'white',
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
        fill: true,
        borderColor: 'white',
        tension: 0.4,
        backgroundColor: 'white',
        labelColor: 'black',
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: { beginAtZero: true },
    },
    responsive: false,
    animation: false,
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
          <Line
            className='lineMetric'
            data={bytesIn}
            options={lineOptions}
          ></Line>
          <Line
            className='lineMetric'
            data={bytesOut}
            options={lineOptions}
          ></Line>
          <Line className='lineMetric' data={cpu} options={lineOptions}></Line>
          <Line className='lineMetric' data={ram} options={lineOptions}></Line>
        </>
      );
    case 'producers':
      return (
        <>
          <Line
            className='lineMetric'
            data={reqPro}
            options={lineOptions}
          ></Line>
          <Line
            className='lineMetric'
            data={msgPro}
            options={lineOptions}
          ></Line>
        </>
      );
    case 'consumers':
      return (
        <>
          <Line
            className='lineMetric'
            data={reqCons}
            options={lineOptions}
          ></Line>
          <Line
            className='lineMetric'
            data={fails}
            options={lineOptions}
          ></Line>
        </>
      );
  }
};

export default Metrics;
