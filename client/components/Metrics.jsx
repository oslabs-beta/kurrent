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
    'Now',
  ]);

  const [bytesInData, setBytesInData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [bytesOutData, setBytesOutData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newBytesInValue = bytesInMetrics;
  //     const newBytesOutValue = bytesOutMetrics;
  //     setBytesInData([...bytesInData.slice(1), newBytesInValue]);
  //     setBytesOutData([...bytesOutData.slice(1), newBytesOutValue]);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // });

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  const bytesIn = {
    labels,
    datasets: [
      {
        label: 'Bytes In',
        data: data,
        fill: true,
        borderColor: 'maroon',
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: { beginAtZero: true },
    },
  };
  return (
    <>
      <div>
        Metrics:
        <div id='metricsContainer'>
          <canvas id='bytesInMetrics'></canvas>
          {/* <Line data={bytesIn} options={lineOptions}></Line> */}
          {/* <Line data={bytesOut} options={lineOptions}></Line> */}
          {/* <Line data={cpu} options={lineOptions}></Line> */}
          {/* <Line data={ram} options={lineOptions}></Line> */}
        </div>
      </div>
    </>
  );
};

export default Metrics;
