import { createSlice } from '@reduxjs/toolkit';

class Queue {
  constructor() {
    this.nextOut = 0;
    this.queue = {};
    this.index = 0;
  }
  enqueue(val) {
    this.queue[this.index] = val;
    this.index++;
  }
  dequeue() {
    this.queue.delete(this.nextOut);
    this.nextOut++;
  }
}

const lineQueue = new Queue();
for (let i = 0; i < 30; i++) {
  lineQueue.enqueue(0);
}

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

const initialState = {
  bytesIn: { ...lineQueue },
  bytesOut: { ...lineQueue },
  cpu: { ...lineQueue },
  ram: { ...lineQueue },
  totReqPro: { ...lineQueue },
  totMsg: { ...lineQueue },
  totReqCon: { ...lineQueue },
  totFails: { ...lineQueue },
};

export const lineSlice = createSlice({
  name: 'line',
  initialState,
  reducers: {
    setData: (state, action) => {
      const data = action.payload;
      console.log(data)
      const newBytesIn = { ...state.bytesIn }.queue
        .dequeue()
        .enqueue(data.bytesIn / 1000);
      state.bytesIn = newBytesIn;
      const newCpuValue = { ...state.cpu }.queue
        .dequeue()
        .enqueue(data.cpu / 1000);
      state.cpu = newCpuValue;
      const newRamValue = { ...state.ram }.queue
        .dequeue()
        .enqueue(data.ramUsage / 1000000);
      state.ram = newRamValue;
      const newTotalReqsPro = { ...state.totReqPro }.queue
        .dequeue()
        .enqueue(data.prodReqTotal);
      state.totReqPro = newTotalReqsPro;
      const newTotalMsg = { ...state.totMsg }.queue
        .dequeue()
        .enqueue(data.prodMessInTotal);
      state.totMsg = newTotalMsg;
      const newTotalReqCon = { ...state.totReqCon }.queue
        .dequeue()
        .enqueue(data.consReqTot);
      state.totReqCon = newTotalReqCon;
      const newBytesOut = { ...state.bytesOut }.queue
        .dequeue()
        .enqueue(data.bytesOut);
      state.bytesOut = newBytesOut;
      const newTotFails = { ...state.totFails }.queue
        .dequeue()
        .enqueue(data.consFailReqTotal);
      state.totFails = newTotFails;
    },
  },
});

export const { setData } = lineSlice.actions;
export default lineSlice.reducer;
