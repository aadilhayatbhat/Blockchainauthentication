const AzureAuth = artifacts.require("AzureAuth");

module.exports = function (deployer) {
  deployer.deploy(AzureAuth);
};
