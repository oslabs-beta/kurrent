const metricsController = {
  async getAllMetrics(req, res, next) {
    const { promAddress } = req.param;
    try {
      // CPU % metric
      const cpu = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(process_cpu_seconds_total[1m])) * 100`
      );

      // bytes In Total metric
      const bytesIn = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(kafka_server_brokertopicmetrics_bytesin_total[1m]))`
      );

      // bytes Out Total metric
      const bytesOut = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(kafka_server_brokertopicmetrics_bytesout_total[1m]))`
      );

      // ram Usage metric
      const ramUsage = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(process_resident_memory_bytes[1m]))`
      );

      // latency metric
      const latency = await fetch(
        `http://${promAddress}/api/v1/query?query=sum(rate(kafka_network_requestmetrics_totaltimems{}[1m]) - rate(kafka_network_requestmetrics_localtimems{}[1m]))`
      );

      // production Request Total metric
      const prodReqTotal = await fetch(
        `http://${promAddress}/api/v1/query?query=rate(kafka_server_brokertopicmetrics_totalproducerequests_total[1m])`
      );

      // productioin Messages In Total
      const prodMessInTotal = await fetch(
        `http://${promAddress}/api/v1/query?query=rate(kafka_server_brokertopicmetrics_messagesin_total[1m])`
      );

      // consumer requests total
      const consReqTot = await fetch(
        `http://${promAddress}/api/v1/query?query=rate(kafka_server_brokertopicmetrics_totalfetchrequests_total[1m])`
      );

      // consumer failed request total
      const consFailReqTotal = await fetch(
        `http://${promAddress}/api/v1/query?query=rate(kafka_server_brokertopicmetrics_failedfetchrequests_total[1m])`
      );

      res.locals.metrics = {
        cpu: cpu.data.result[0].value[1],
        bytesIn: bytesIn.data.result[0].value[1],
        bytesOut: bytesOut.data.result[0].value[1],
        ramUsage: ramUsage.data.result[0].value[1],
        latency: latency.data.result[0].value[1],
        prodReqTotal: prodReqTotal.data.result[0].value[1],
        prodMessInTotal: prodMessInTotal.data.result[0].value[1],
        consReqTot: consReqTot.data.result[0].value[1],
        consFailReqTotal: consFailReqTotal.data.result[0].value[1],
      };
      return next();
    } catch (error) {
      const errObj = {
        log: 'Error in getAllMetrics middleware',
        status: 400,
        message: 'Could not get metrics',
      };
      return next(errObj);
    }
  },
};

module.exports = metricsController;
