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

const loading = {
  labels: [],
  datasets: [
    {
      label: 'Loading',
      data: [],
      backgroundColor: 'rgba(255,0,0)',
      borderColor: 'rgba(255,0,0)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(255,0,0)',
    },
  ],
};

const Metrics = () => {
  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const bytesIn = {
    labels: labels,
    datasets: [
      {
        labels: labels,
        data: [3, 2, 9, 5, 6, 9, 8, 6, 5],
        backgroundColor: 'aqua',
        borderColor: 'black',
        pointBorderColor: 'aqua',
        fill: {
          target: 'origin',
        },
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {};
  return (
    <>
      <div>
        Metrics:
        <div id='metricsContainer'>
          <Line data={bytesIn} options={lineOptions}></Line>
          {/* <Line data={bytesOut} options={lineOptions}></Line> */}
          {/* <Line data={cpu} options={lineOptions}></Line> */}
          {/* <Line data={ram} options={lineOptions}></Line> */}
        </div>
      </div>
    </>
  );
};

export default Metrics;
