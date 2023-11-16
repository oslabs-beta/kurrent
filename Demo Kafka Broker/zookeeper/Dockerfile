FROM wurstmeister/zookeeper:latest
ADD zookeeper.yaml /opt/zookeeper-3.4.13/lib/zookeeper.yaml

RUN wget https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/0.19.0/jmx_prometheus_javaagent-0.19.0.jar

RUN cp jmx_prometheus_javaagent-0.19.0.jar /opt/zookeeper-3.4.13/lib/jmx_prometheus_javaagent.jar
RUN chmod +r /opt/zookeeper-3.4.13/lib/jmx_prometheus_javaagent.jar

EXPOSE 7070