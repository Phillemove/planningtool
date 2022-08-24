const {assert, expect} = require('chai');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const toDoCollectionModel = require('../../models/ToDo_Collection');
const toDoModel = require('../../models/ToDo');
const repo = require('../../Repository');
const {stub} = require("sinon");

describe('Todo_Collection Model: test/model/toDo_Collection.spec.js', function () {

    after(function (done) {
        sandbox.restore();
        done();
    })

    afterEach(function (done) {
        sandbox.restore();
        done();
    })

    // creates ToDo_Collection witch stubbed loadAllTodos function. this function will be stubbed before initialisation by manipulation the prototype
    function setUpStubedToDo_CollectionObj(containedTodos) {
        // containdedTods have to be passed in an array
        const stub = sandbox.stub(toDoCollectionModel.prototype, "loadAllTodos");
        stub.callsFake(() => {
            return Promise.resolve(containedTodos)
        })
        return new toDoCollectionModel();
    }
    describe("Unit Tests", function () {

        describe("#createToDo", function () {

            it('should create new ToDo - Object with given arguments ', function (done) {

                // Params for To-Do testobject
                const title = "Test ToDo";
                const description = "This is a tests description";
                const dueDate = null;
                const owner = 1;

                //createing toDo_Collection object with
                const toTo_Collection = new toDoCollectionModel();

                // creating fake toDoModel - constructor is never called
                const stubToDo = sandbox.createStubInstance(toDoModel);

                // mocking ToDo_Collection.saveTodo since this is a unit test, it is tested if saveTodo is called and with which arguments though.
                const mock = sandbox.mock(toTo_Collection);
                const mockSaveToDo = mock.expects("saveToDo");
                mockSaveToDo.once();
                mockSaveToDo.withArgs(stubToDo);

                // executing Methode which shall be tested
                toTo_Collection.createToDo(title, description, dueDate, owner);

                // verifying results
                mock.verify();
                done();
            });
        });
// get array of all todos
        describe("#getToDo", function () {

            it('should return faked ToDo - objects in an array ', function (done) {
                const fakeToDo = [sandbox.createStubInstance(toDoModel)];

                // setting up toDo_Collection with stubbed loaddAllTodos() to prevent repo from being called.
                const toDo_Collection = setUpStubedToDo_CollectionObj(fakeToDo);

                // setting up spy to verify that get for todoproperty ist used
                const spy = sandbox.spy(toDo_Collection, "todos", ["get"]);

                toDo_Collection.loadAllTodos().then((todos) => {
                    // calling methode which to test
                    const toDoArray = toDo_Collection.todos;

                    //Evaluating results
                    assert.isTrue(spy.get.calledOnce);
                    assert.equal(toDoArray, fakeToDo);
                    done();

                }).catch((e) => {
                    console.log("Promise could not be resolved");
                    assert.isTrue(spy.get.calledOnce);
                    assert.equal([], fakeToDo);
                    done();
                })
            });
        })
    describe("#loadAllTodos", function () {

            it("Expect Repository.getAllToDos to be called once for every call", function (done) {
                // mocking Repository.getAllToDos() to prevent an actual call
                const mock = sandbox.mock(repo);
                const expectation = mock.expects("getAllToDos");

                // observing behavior of calling Repository.getAllToDos()
                expectation.once();
                expectation.withExactArgs();

                new toDoCollectionModel();

                mock.verify();
                done();
            })
        })
        describe("#getToDoForId", function () {

            it("Expect to return toDo object with uuid = 1 and no toDo object with uuid = 2", function (done) {

                // test toDo_model parameters
                const title = "Test ToDo";
                const description = "This is a tests description";
                const uuid = 1;

                // uuid of todo_object that can not be found
                const unvalid_uuid = 2;

                // stubbing getter of uuid to return 1
                sandbox.stub(toDoModel.prototype, "uuid")
                    .get(() => {
                        return uuid;
                    });
                // creating test toDo_model instance with stubbed get uuid - Methode which retunrs 1
                const toDo_model = new toDoModel(title, description);

                // creating toDo_Collection with stubbed loadAllTodos. Stubbing loadAllTodos to returns toDo_model as only object
                const toDo_Collection = setUpStubedToDo_CollectionObj([toDo_model]);

                toDo_Collection.loadAllTodos().then(() => {
                    const returnedToDoObjRightUuid = toDo_Collection.getToDo(uuid);
                    const returnedToDoObjWrongUuid = toDo_Collection.getToDo(unvalid_uuid);
                    assert.equal(returnedToDoObjRightUuid, toDo_model);
                    assert.equal(returnedToDoObjWrongUuid, null);

                    done();
                }).catch(() => {
                        // to avoid timeout which may slow down testing if tests fails.
                        const returnedToDoObjRightUuid = toDo_Collection.getToDo(uuid);
                        const returnedToDoObjWrongUuid = toDo_Collection.getToDo(unvalid_uuid);
                        assert.equal(returnedToDoObjRightUuid, toDo_model);
                        assert.equal(returnedToDoObjWrongUuid, null);
                        done();
                    }
                )
            });

            it("Expect to return no toDo object as no toDo object is existing ", function (done) {

                // uuid of todo_object that can not be found
                const unvalid_uuid = 1;

                // creating toDo_Collection with stubbed loadAllTodos. stubbing loadAllTodos to return toDo_model as only object.
                const toDo_Collection = setUpStubedToDo_CollectionObj([]);
                toDo_Collection.loadAllTodos().then(() => {
                    const returnedToDoObj = toDo_Collection.getToDo(unvalid_uuid);
                    assert.equal(returnedToDoObj, null)
                    done();
                }).catch(() => {
                        // to avoid timeout which may slow down testing if tests fails.
                        const returnedToDoObj = toDo_Collection.getToDo(unvalid_uuid);
                        assert.equal(returnedToDoObj, null);
                        done();
                    }
                )
            });
        })
    describe("#updateToDo", function () {
            it("Expect to return true if todo_object got changed and false if not", function (done) {
                // stubbed Repository.updateToDo() to always return true
                sandbox.stub(repo, "updateToDo")
                    .onFirstCall()
                    .callsFake(function () {
                        return Promise.resolve(true);
                    }).onSecondCall()
                    .callsFake(function () {
                        return Promise.resolve(false);
                    })

                // creating fakeTodo to use as parameter for ToDo_Collection.updateToDo()
                const fakeTodo = sandbox.createStubInstance(toDoModel);

                // stubbed ToDo_Collection.loadAllTodos() to return empty list
                const toDo_Collection = setUpStubedToDo_CollectionObj([]);

                toDo_Collection.updateToDo(fakeTodo).then((toDoIsUpdated) => {
                    //validating results for first call
                    assert.isTrue(toDoIsUpdated);
                    sandbox.assert.calledTwice(toDo_Collection.loadAllTodos);
                    sandbox.assert.calledOnce(repo.updateToDo);
                }).then(() =>
                    toDo_Collection.updateToDo(fakeTodo)
                ).then((toDoIsUpdated) => {
                    //validating results for second call
                    assert.isFalse(toDoIsUpdated);
                    sandbox.assert.calledTwice(toDo_Collection.loadAllTodos); // if else this.loadAllTodos shall not be called
                    sandbox.assert.calledTwice(repo.updateToDo);
                    done();
                });
            })
        })
        describe("#saveToDo", function () {
            it("Expected to call Repository.saveToDo once witch given toDo_object", function (done) {

                // creating fake toDomodel
                const fakeTodo = sandbox.createStubInstance(toDoModel);

                // mocking repo to prevent repo from being called and being able to spy on calls
                const mock = sandbox.mock(repo);
                const expectation = mock.expects("saveToDo");

                // setting up expectation which have to be matched to pass
                expectation.once();
                expectation.withExactArgs(fakeTodo);

                const toDo_Collection = setUpStubedToDo_CollectionObj([]);
                toDo_Collection.saveToDo(fakeTodo).then(() => {
                    mock.verify();
                    done();
                });
            })

            it("Expected to call Repository.saveToDo once witch given toDo_object", function (done) {

                // ids which present possible returnvalues (bilden äquivalenzklassen ab) of Repository.saveToDo()
                const id_null = null;
                const id_one = 1;

                // creating fake toDomodel
                const fakeTodo = sandbox.createStubInstance(toDoModel);

                // stubbing Repository.saveTodo() to return null on first call, 1 on second call.
                sandbox.stub(repo, "saveToDo").onFirstCall().callsFake(() => {
                    return Promise.resolve(id_null);
                }).onSecondCall().callsFake(() => {
                    return Promise.resolve(id_one);
                });

                const toDo_Collection = setUpStubedToDo_CollectionObj([]);
                // calling saveToDo twice. With Repository.saveToDo() returning null for first call and 1 for second call.
                toDo_Collection.saveToDo(fakeTodo).then((id) => {
                    // expected to return null
                    assert.equal(id, id_null)
                }).then(() =>
                    {return toDo_Collection.saveToDo(fakeTodo)}
                ).then((id) => {
                    // expected to return id that was returned by Repository.saveTodo()
                    assert.equal(id, id_one);
                })
                done();
            })

        })

    describe("#saveToDoParticipant", function () {
            it("Expected to call Repository.saveToDoParticipants once and witch given arguments", function (done) {

                // fake ids
                const todoUUID = 1;
                const participantUUIDs = 2;

                const mock = sandbox.mock(repo);
                const expectation = mock.expects("saveToDoParticipant");

                // setting up expectation.
                expectation.once();
                expectation.withExactArgs(todoUUID, participantUUIDs);

                const toDo_Collection = setUpStubedToDo_CollectionObj([]);
                toDo_Collection.saveToDoParticipant(todoUUID, participantUUIDs);

                mock.verify();
                done();
            })
        })

        describe("#saveToDoFiles", function () {
            it("Expected to call Repository.saveToDoFiles once and witch given arguments", function (done) {

                // fake ids
                const todoUUID = 1;
                const filesUUIDs = 2;

                const mock = sandbox.mock(repo);
                const expectation = mock.expects("saveToDoFiles");

                // setting up expectation.
                expectation.once();
                expectation.withExactArgs(todoUUID, filesUUIDs);

                const toDo_Collection = setUpStubedToDo_CollectionObj([]);
                toDo_Collection.saveToDoFiles(todoUUID, filesUUIDs);

                mock.verify();
                done();
            })
        })

        describe("#deleteToDo", function () {
            it("Expected to call Repository.deleteToDo once witch given toDo_object", function (done) {
                // id that will be passed as argument
                const uuidTrue = 1;
                const uuidFalse = 41;

                // ids which present possible returnvalues (bilden äquivalenzklassen ab) of Repository.saveToDo()
                const returnIdTrue = 1;
                const id_returnIdFalse = null;

                // stubbing Repository.saveTodo() to return null on first call, 1 on second call.
                sandbox.stub(repo, "deleteToDo").withArgs(uuidTrue).callsFake(() => {
                    return Promise.resolve(returnIdTrue);
                }).withArgs(uuidFalse).callsFake(() => {
                    return Promise.resolve(id_returnIdFalse);
                });

                // creating fake toDomodel
                const fakeTodoOne = sandbox.createStubInstance(toDoModel);
                const fakeTodoTwo = sandbox.createStubInstance(toDoModel);

                const toDo_Collection = setUpStubedToDo_CollectionObj([fakeTodoOne, fakeTodoTwo]);

                setTimeout(() => {
                    // calling saveToDo twice. With Repository.saveToDo() returning null for first call and 1 for second call.
                    toDo_Collection.deleteToDo(uuidTrue).then((deleteSucsesfull) => {
                        assert.isTrue(deleteSucsesfull);
                    }).then(() =>
                        toDo_Collection.deleteToDo(uuidFalse)
                    ).then((deleteSucsesfull) => {
                        // if uuid does not match any todo_object none will be deleted  Repository.deleteToDo() will
                        // return null which shall lead to false being returned
                        assert.isFalse(deleteSucsesfull);
                        done();
                    });
                },);
                done();
            });
        });
    });
    describe("Integration Tests", function () {
        describe("Instanziation of ToDo_Collection - Object", function () {
            it("ToDo_Collection should load all todos from Repository at Instanziation-time. Those todos " +
                "should be the same as returned by ToDo_Collection.tods()", function (done) {

                // creating fake toDomodel
                const fakeTodoOne = sandbox.createStubInstance(toDoModel);
                const fakeTodoTwo = sandbox.createStubInstance(toDoModel);
                const constFakeTodos = [fakeTodoOne, fakeTodoTwo];

                // setting up mock for toDoCollectionModel
                const mock = sandbox.mock(toDoCollectionModel.prototype);
                // Mocking loadAllTodos to return fakeTodos and set up expectations
                mock.expects("loadAllTodos").callsFake(() => {
                    return Promise.resolve(constFakeTodos)
                }).once();

                // Instanziate object from class ToDos with stubbed loadAllTodo() to avoid calling the repository.
                const toDo_Collection = new toDoCollectionModel();

                // testing if get todos() returns all objects that were returned by loadAllTodos();
                setTimeout(() => {
                    assert.equal(toDo_Collection.todos, constFakeTodos);
                    mock.verify();
                    done();
                },);
            });
        });
    });
})
;

