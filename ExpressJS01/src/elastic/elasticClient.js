// elastic/elasticClient.js
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "changeme", // pass bạn set khi run docker
  },
  tls: {
    rejectUnauthorized: false, // bỏ qua SSL self-signed
  },
});

module.exports = client;
