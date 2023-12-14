import { Request, Response, NextFunction, RequestHandler } from 'express';
import path from 'path';

type Controller = {
  getAllMetrics: RequestHandler;
};

export const metricsController: Controller = {
  async getAllMetrics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // retrieve the prometheus address from the request query
    const { promAddress } = req.query;

    // helper function to check the promAddress formatting
    const formatIsCorrect = (promAddress): boolean => {
      const [ip, port]: string[] = promAddress.split(':');
      let validIP: boolean = false,
        validPort: boolean = false;
      if (ip === 'localhost') validIP = true;
      else if (
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          ip
        )
      ) {
        validIP = true;
      }
      if (port.length === 4 && /[0-9]/g.test(port)) validPort = true;
      return validIP && validPort;
    };
    if (!formatIsCorrect(promAddress)) {
      return next({
        log: 'Error in getAllMetrics middleware: Improper address formatting',
        status: 400,
        message: 'Improper Prometheus Address Input',
      });
    }

    // try block for fetching kafka metrics using promQL
    try {
      // CPU % metric
      let cpu = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(process_cpu_seconds_total[1m])) * 100`
      );
      cpu = await cpu.json();

      // bytes In Total metric
      let bytesIn = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(kafka_server_brokertopicmetrics_bytesin_total[1m]))`
      );
      bytesIn = await bytesIn.json();

      // bytes Out Total metric
      let bytesOut = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(kafka_server_brokertopicmetrics_bytesout_total[1m]))`
      );
      bytesOut = await bytesOut.json();

      // ram Usage metric
      let ramUsage = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(process_resident_memory_bytes[1m]))`
      );
      ramUsage = await ramUsage.json();

      // latency metric
      let latency = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(kafka_network_requestmetrics_totaltimems{}[1m]) - rate(kafka_network_requestmetrics_localtimems{}[1m]))`
      );
      latency = await latency.json();

      // production Request Total metric
      let prodReqTotal = await fetch(
        `http://${promAddress}/api/v1/query?query=rate(kafka_server_brokertopicmetrics_totalproducerequests_total[1m])`
      );
      prodReqTotal = await prodReqTotal.json();

      // productioin Messages In Total
      let prodMessInTotal = await fetch(
        `http://${promAddress}/api/v1/query?query=rate(kafka_server_brokertopicmetrics_messagesin_total[1m])`
      );
      prodMessInTotal = await prodMessInTotal.json();

      // consumer requests total
      let consReqTot = await fetch(
        `http://${promAddress}/api/v1/query?query=rate(kafka_server_brokertopicmetrics_totalfetchrequests_total[1m])`
      );
      consReqTot = await consReqTot.json();
      // consumer failed request total
      let consFailReqTotal = await fetch(
        `http://${promAddress}/api/v1/query?query=rate(kafka_server_brokertopicmetrics_failedfetchrequests_total[1m])`
      );
      consFailReqTotal = await consFailReqTotal.json();

      // Returned Object - each value is a single number value
      res.locals.metrics = {
        cpu: cpu.data.result[0].value[1],
        bytesIn: bytesIn.data.result[0].value[1] / 1000,
        bytesOut: bytesOut.data.result[0].value[1] / 1000,
        ramUsage: ramUsage.data.result[0].value[1] / 1000000,
        latency: latency.data.result[0].value[1],
        prodReqTotal: prodReqTotal.data.result[0].value[1],
        prodMessInTotal: prodMessInTotal.data.result[0].value[1],
        consReqTot: consReqTot.data.result[0].value[1],
        consFailReqTotal: consFailReqTotal.data.result[0].value[1],
      };
      return next();
    } catch (error) {
      return next({
        log: 'Error in getAllMetrics middleware:' + error,
        status: 400,
        message: 'Could not get metrics',
      });
    }
  },
};
