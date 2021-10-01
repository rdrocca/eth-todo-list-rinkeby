const TodosContract = artifacts.require("TodosContract");

contract("TodosContract", () => {

  before(async () => {
    this.todosContract = await TodosContract.deployed()
  })

  it("Migrate deployed successfully", async () => {
    const address = this.todosContract.address;
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  })

  it("Get todos list", async () => {
    const todosCounter = await this.todosContract.todosCounter();
    const todo = await this.todosContract.todosMap(todosCounter);
    assert.equal(todo.id.toNumber(), todosCounter);
    assert.equal(todo.title, "ASAP");
    assert.equal(todo.description, "Check out https://github.com/rdrocca");
    assert.equal(todo.done, false);
    assert.equal(todosCounter, 1);
  })

  it("Todo created successfully", async () => {
    const result = await this.todosContract.createTodo("some todo", "some description");
    const todoCreatedEvent = result.logs[0].args;
    const todosCounter = await this.todosContract.todosCounter();

    assert.equal(todosCounter, 2);
    assert.equal(todoCreatedEvent.id.toNumber(), 2);
    assert.equal(todoCreatedEvent.title, "some todo");
    assert.equal(todoCreatedEvent.description, "some description");
    assert.equal(todoCreatedEvent.done, false);
  })

  it("Todo toggled done", async () => {
    const result = await this.todosContract.toggleDone(1);
    const todoCreatedEvent = result.logs[0].args;
    const todo = await this.todosContract.todosMap(1);

    assert.equal(todo.done, true);
    assert.equal(todoCreatedEvent.id.toNumber(), 1);
    assert.equal(todoCreatedEvent.done, true);
  })


})