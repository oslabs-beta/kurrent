# Kurrent

Apache Kafka cluster metrics visualizer

### Kurrent is an open-source project providing real-time Apache Kafka metrics data monitoring. Our tool is dedicated to providing developers an easy and intuitive means for monitoring the health and throughput of their Kafta cluster.

---

# Features

User profile: Sign up and login to your profile to store your Prometheus server connections for easy navigation between all your Kafka instances.

Real-Time Metrics: View your metrics in real-time with Kurrents intuitive dashboard charts to monitor the ongoing health of your cluster through testing or real-time use.

Prometheus Integration: Kurrent provides a sample Prometheus yaml to make it easy to setup your Kafka clusters for metrics monitoring

# Tech Stack

<div align='center'>

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node](https://img.shields.io/badge/-node-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prometheus](https://img.shields.io/badge/Prometheus-E7532D?style=for-the-badge&logo=prometheus&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4EA94B?style=for-the-badge&logo=postgres&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/apache%20kafka-%2320232a.svg?style=for-the-badge&logo=apachekafka&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)
![Testing Library](https://img.shields.io/badge/testing%20library-323330?style=for-the-badge&logo=testing-library&logoColor=red)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

</div>

---

## Getting Started

To install locally, fork and clone this Github repository.

- Create a .env file in the main directory and create a variable DB_URI set equal to your PostgreSQL server instance URI
- Instanciate the database tables with the following commands:
  - `CREATE TABLE users (
user_id serial PRIMARY KEY,
email VARCHAR(255) NOT NULL,
username VARCHAR(255),
password VARCHAR(255) NOT NULL,
service_addresses text[][])`
  - `CREATE TABLE sessions (
session_id serial PRIMARY KEY,
user_id INT REFERENCES users(user_id),
session_token VARCHAR(255) NOT NULL,
login_time timestamp,
session_status VARCHAR(20) DEFAULT 'active')`
  - In the terminal run:
    - `npm install`
    - `npm run dev`
  - Once the application is running, navigate to localhost:8080, create an account, and connect your Prometheus server with its ip:port address

---

## Contribute

If you'd like to contribute to the project and improve its current functionality or add a feature, please fork the repository and submit a pull request. Some of our planned future features include:

- Typescript migration
- User defined alerts
- Open Authorization
- More testing coverage
- Save and compare metrics from past runs or between different clusters

## The Team

<table>
  <tr>
    <td align="center">
      <img src="" width="140px;" alt="a photo of Garrett Byrne"/>
      <br />
      <sub><b>Garrett Byrne</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/garrett-byrne12/">Linkedin</a> |
      <a href="https://github.com/G-Byrne">GitHub</a>
    </td>
     <td align="center">
      <img src="" width="140px;" alt="a photo of Jensen Schmidt"/>
      <br />
      <sub><b>Jensen Schmidt</b></sub>
      <br />
      <a href="">Linkedin</a> |
      <a href="">GitHub</a>
    </td> <td align="center">
      <img src="" width="140px;" alt="a photo of Michael Newbold"/>
      <br />
      <sub><b>Michael Newbold</b></sub>
      <br />
      <a href="">Linkedin</a> |
      <a href="">GitHub</a>
    </td> <td align="center">
      <img src="" width="140px;" alt="a photo of Swarna Muralidharan"/>
      <br />
      <sub><b>Swarna Muralidharan</b></sub>
      <br />
      <a href="">Linkedin</a> |
      <a href="">GitHub</a>
    </td>     
  </tr>
</table>
