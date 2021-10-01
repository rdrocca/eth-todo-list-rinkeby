App = {
  contracts: {},
  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderTodos();
  },
  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask "
      );
    }
  },
  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
  },
  loadContract: async () => {
    try {
      // const networkId = await web3.eth.net.getId();
      App.contracts.TodosContract = new web3.eth.Contract(
        [
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "indexed": false,
                "internalType": "bool",
                "name": "done",
                "type": "bool"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
              }
            ],
            "name": "TodoCreatedEvent",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "bool",
                "name": "done",
                "type": "bool"
              }
            ],
            "name": "TodoToggledEvent",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "_description",
                "type": "string"
              }
            ],
            "name": "createTodo",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
              }
            ],
            "name": "toggleDone",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [],
            "name": "todosCounter",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "todosMap",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "done",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ], '0x9791C3152de4746AcceD41758567b5dFe324A731'
      );
      App.todosContract = await App.contracts.TodosContract;
    } catch (error) {
      console.error(error);
    }
  },
  render: async () => {
    document.getElementById("account").innerText = App.account;
  },
  renderTodos: async () => {
    const todosCounter = await App.todosContract.methods.todosCounter().call({ from: App.account });

    let html = "";

    for (let i = 1; i <= todosCounter; i++) {
      const todo = await App.todosContract.methods.todosMap(i).call({ from: App.account });
      const todoId = todo[0];
      const todoTitle = todo[1];
      const todoDescription = todo[2];
      const todoDone = todo[3];
      const todoCreatedAt = todo[4];

      // Creating a todo Card
      let todoElement = `<div class="card bg-dark rounded-0 mb-2">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>${todoTitle}</span>
          <div class="form-check form-switch">
            <input class="form-check-input" data-id="${todoId}" type="checkbox" onchange="App.toggleDone(this)" ${todoDone === true && "checked"
        }>
          </div>
        </div>
        <div class="card-body">
          <span>${todoDescription}</span>
          <p class="text-muted">Todo was created ${new Date(
          todoCreatedAt * 1000
        ).toLocaleString()}</p>
          </label>
        </div>
      </div>`;
      html += todoElement;
    }

    document.querySelector("#todosList").innerHTML = html;
  },
  createTodo: async (title, description) => {
    try {
      const result = await App.todosContract.methods.createTodo(title, description).send({ from: App.account });
      // console.log(result)
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  },
  toggleDone: async (element) => {
    const todoId = element.dataset.id;
    // console.log(todoId);
    await App.todosContract.methods.toggleDone(todoId).send({ from: App.account });
    window.location.reload();
  },
};