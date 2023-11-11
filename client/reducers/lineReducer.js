import { createSlice } from '@reduxjs/toolkit';

const createQueue = (size = 30) => ({
  items: Array(size).fill(0),
  size,
});


const enqueue = (queue, value) => {
  queue.items.push(value);
  if (queue.items.length > queue.size) {
    queue.items.shift();
  }
  return queue;
};

const dequeue = (queue) => {
  queue.items.shift();
};

// const stateCreator = () => {
//   const output = {};
//   output.labels = [];
//   for (let i = 0; i < 30; i++) {
//     if (i === 0) output.labels.push('-15s');
//     else if (i === 29) output.labels.push('Now');
//     else output.labels.push('');
//   }
//   const dataset = {
//     label: labels[j]
//     
//   }
// }

const initialQueue = createQueue();

const initialState = {
  bytesIn: initialQueue,
  bytesOut: initialQueue,
  cpu: initialQueue,
  ram: initialQueue,
  totReqPro: initialQueue,
  totMsg: initialQueue,
  totReqCon: initialQueue,
  totFails: initialQueue,
};

const updateQueue = (queue, newValue) => {
  const newQueue = new Queue();
  newQueue.queue = { ...queue.queue } // This will copy properties but not the methods
  newQueue.enqueue(newValue);
  newQueue.dequeue();
  return newQueue;
};


export const lineSlice = createSlice({
  name: 'line',
  initialState,
  reducers: {
    setData: (state, action) => {
      const data = action.payload;
      for (let metric in data) {
        state[metric] = enqueue(state[metric], data[metric])
      }
    },
  },
});

export const { setData } = lineSlice.actions;
export default lineSlice.reducer;
