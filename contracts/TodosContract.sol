/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TodosContract {
    uint256 public todosCounter = 0;

    struct TodoStruct {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    event TodoCreatedEvent(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    event TodoToggledEvent(uint256 id, bool done);

    mapping(uint256 => TodoStruct) public todosMap;

    constructor() {
        createTodo("ASAP", "Check out https://github.com/rdrocca");
    }

    function createTodo(string memory _title, string memory _description)
        public
    {
        todosCounter++;
        todosMap[todosCounter] = TodoStruct(
            todosCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
        emit TodoCreatedEvent(
            todosCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
    }

    function toggleDone(uint256 _id) public {
        TodoStruct memory _todo = todosMap[_id];
        _todo.done = !_todo.done;
        todosMap[_id] = _todo;
        emit TodoToggledEvent(_id, _todo.done);
    }
}
