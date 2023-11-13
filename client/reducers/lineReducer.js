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
