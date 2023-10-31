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
  PointElement
);

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
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newBytesInValue = Math.floor(Math.random() * 100);
      setBytesInData([...bytesInData.slice(1), newBytesInValue]);
    }, 100);
    return () => clearInterval(interval);
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newBytesInData = []
  //     bytesInData.forEach((byte) => newBytesInData.push(byte + 1)) ;
  //     setBytesInData([...bytesInData.slice(1), newBytesInData])
  //   }, 500);
  //   interval();
  // }, []);

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
        borderColor: 'maroon',
        tension: 0.1,
        backgroundColor: 'maroon',
        labelColor: 'black',
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: { beginAtZero: true },
    },
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
  return (
    <>
      <div>
        Metrics:
        <div id='metricsContainer'>
          {/* <canvas id='bytesInMetrics'></canvas> */}
          <Line data={bytesIn} options={lineOptions}></Line>
          <Line data={bytesOut} options={lineOptions}></Line>
          {/* <Line data={cpu} options={lineOptions}></Line> */}
          {/* <Line data={ram} options={lineOptions}></Line> */}
        </div>
      </div>
    </>
  );
};

export default Metrics;
