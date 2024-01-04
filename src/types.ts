export type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

export type Metric = {
  data: {
    result: [{ value: number[] }];
  };
};

export type LineStateType = {
  bytesIn: number[];
  bytesOut: number[];
  cpu: number[];
  ram: number[];
  totReqPro: number[];
  totMsg: number[];
  totReqCon: number[];
  totFails: number[];
}

export type DashStateType = {
  currentCluster: string,
  clusterView: string,
  addingCluster: boolean,
  clusters: string[],
}

export type AuthStateType = {
  username: string,
  email: string,
  authType: string,
  passMatch: boolean,
  isLoggedIn: boolean,
  userExists: string,
  isEmailValid: boolean,
}

export type StateStoreType = {
  login: AuthStateType,
  dashboard: DashStateType,
  line: LineStateType,
}