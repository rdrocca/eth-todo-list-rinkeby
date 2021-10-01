const TodosContract = artifacts.require("TodosContract");

module.exports = function (deployer) {
  deployer.deploy(TodosContract);
};
