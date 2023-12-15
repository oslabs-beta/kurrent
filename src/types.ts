export type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

export type Metric = {
  data: {
    result: [{}]
  }
};
