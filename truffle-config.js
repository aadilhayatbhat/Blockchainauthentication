module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      from: "0xCE1490982993B47997cA61756F931b4F49cef7AD",
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
