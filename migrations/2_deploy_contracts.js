var Pago = artifacts.require("./Pagos.sol");

module.exports = function(deployer) {
  deployer.deploy(Pago);
};

