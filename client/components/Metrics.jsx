import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
//Registering our chartJS elements for use in rendering
ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler
);
//Global options for the chartJS elements
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
  resize: true,
};

const Metrics = () => {
  const dashboard = useSelector((state) => state.dashboard);
  const lineData = useSelector((state) => state.line);
  const labels = new Array(29).fill('').concat('Now');
  //creates data objects for use in our specific metrics elements
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
  //Each metric to be used calls upon the helper function passing in the desired label, and the dataKey used in the backend
  const bytesIn = createDataset('Bytes In', 'bytesIn');
  const bytesOut = createDataset('Bytes Out', 'bytesOut');
  const cpu = createDataset('CPU Usage %', 'cpu');
  const ram = createDataset('Ram Usage MB', 'ram');
  const totReqPro = createDataset('Total Requests', 'totReqPro');
  const totMsg = createDataset('Total Messages In', 'totMsg');
  const totReqCon = createDataset('Total Requests', 'totReqCon');
  const totFails = createDataset('Total Failed Requests', 'totFails');

  const currentCluster = useSelector((state) => state.dashboard.currentCluster);
  const dispatch = useDispatch();
  //Update state every 500ms to display new metrics
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
          dispatch(
            setData({
              bytesIn: metrics.bytesIn,
              bytesOut: metrics.bytesOut,
              cpu: metrics.cpu,
              ram: metrics.ramUsage,
              totReqPro: metrics.prodReqTotal,
              totMsg: metrics.prodMessInTotal,
              totReqCon: metrics.consReqTot,
              totFails: metrics.consFailReqTotal,
            })
          );
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentCluster]);

  //Switch case statement is used here to change which charts are rendered based off the clusterView in our dashboard reducer.
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
