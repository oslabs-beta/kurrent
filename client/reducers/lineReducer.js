import { createSlice } from '@reduxjs/toolkit';
//Creating a queue to handle the metrics flow
const createQueue = (size = 30) => ({
  items: Array(size).fill(0),
  size,
});
//Enqueue helper function which will push new metric values onto the queue and if the queue size is greater than 30, we will shift the first item in our queue
const enqueue = (queue, value) => {
  queue.items.push(value);
  if (queue.items.length > queue.size) {
    queue.items.shift();
  }
  return queue;
};

const initialQueue = createQueue();
//Creating an initial state which each metric has its own queue
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
//exporting the line slice where we iterate through our incomming data and add on the new metric into our queue
export const lineSlice = createSlice({
  name: 'line',
  initialState,
  reducers: {
    setData: (state, action) => {
      const data = action.payload;
      for (let metric in data) {
        state[metric] = enqueue(state[metric], data[metric]);
      }
    },
  },
});

export const { setData } = lineSlice.actions;
export default lineSlice.reducer;
