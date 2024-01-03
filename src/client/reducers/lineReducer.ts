import { createSlice } from '@reduxjs/toolkit';
import { LineStateType } from '../../types';
//Creating a queue to handle the metrics flow
const createQueue = (size = 30): number[] => {
  return Array(size).fill(0);
};
//Enqueue helper function which will push new metric values onto the queue and if the queue size is greater than 30, we will shift the first item in our queue
const enqueue = (queue: number[], value: number) => {
  queue.push(value);
  queue.shift();
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

type data = {
  bytesIn: number;
  bytesOut: number;
  cpu: number;
  ram: number;
  totReqPro: number;
  totMsg: number;
  totReqCon: number;
  totFails: number;
};

//exporting the line slice where we iterate through our incomming data and add on the new metric into our queue
export const lineSlice = createSlice({
  name: 'line',
  initialState,
  reducers: {
    setData: (state, action) => {
      const data: data = action.payload;
      for (let metric in data) {
        state[metric as keyof LineStateType] = enqueue(
          state[metric as keyof LineStateType],
          data[metric as keyof data]
        );
      }
    },
  },
});

export const { setData } = lineSlice.actions;
export default lineSlice.reducer;
