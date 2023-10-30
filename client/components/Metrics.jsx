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
  const data = {
    labels: ['Mon', 'Tues', 'Wed'],
    datasets: [
      {
        label: '369',
        data: [3, 6, 9],
        backgroundColor: 'aqua',
        borderColor: 'black',
        borderWidth: 1,
      },
      {
        label: '333',
        data: [2, 4, 7],
        backgroundColor: 'marine',
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  };

  const dataPie = {
    labels: ['One', 'Two', 'Three'],
    datasets: [
      {
        data: [3, 6, 9],
        backgroundColor: ['aqua', 'bloodorange', 'purple'],
      },
    ],
  };
  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const dataLine = {
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

  const options = {};
  const lineOptions = {
    plugins: {
      legend: true,
    },
  };
  return (
    <>
      <div>
        Metrics:
        <div>
          <Bar id='BarChart' data={data} options={options}></Bar>
        </div>
        <div>
          <Pie data={dataPie} options={options}></Pie>
        </div>
        <div>
          <Line data={dataLine} options={lineOptions}></Line>
        </div>
      </div>
    </>
  );
};

export default Metrics;
