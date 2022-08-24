const {assert} = require('chai');
const contactModel = require('../../models/Contact');
const sandbox = require('sinon').createSandbox();

describe('#Contact Model: test/model/contact.spec.js', function () {

    afterEach(function (done) {
        sandbox.restore();
        done();
    });

    // sets up contactModel with default parameters, which can specified
    function setUpTestModel(name = "Max", surname = "Mustermann", email = "max@musterman.com", address = sandbox.spy(), files = sandbox.spy()) {
        const contact = new contactModel(name, surname, email, address, files);
        return {contact, params: {name, surname, email, address, files}}; // allows for accessing spies and other defaultvalues
    }


    describe('Unit Test', function () {
        describe("Setter, Getter and Constructor work on the same property", function () {
            //tests if setter getter and constructor all work on the same origin

            // since this test works the same for each constructor, set, get - Set, this function is defined here and can be called inside the test
            function testSetGetConstrucEquallity(propertyToTest, setUpFunc) {
                let propToTestAsString;

                // check that propertyToTest is passed as a string.
                try {
                    propToTestAsString = propertyToTest.toString();
                } catch (e) {
                    console.log("Name of function has to be of type String")
                    throw e;
                }

                // setup spy which will be passe as argument -> since all properties are private we can not spy on them directly
                const spyCallback1 = sandbox.spy()
                // spyCallback has to be placed at the right position in setUpFunc. that is why we use a wraper / dependency Injection
                const {contact} = setUpFunc(spyCallback1);

                // get und constructor access same Value
                assert.equal(contact[propToTestAsString], spyCallback1);
                assert.isTrue(spyCallback1.notCalled); // is not supposed to manipulateValue

                // set und get access same value
                const spyCallback2 = sandbox.spy()
                contact[propToTestAsString] = spyCallback2;
                assert.equal(contact[propToTestAsString], spyCallback2);
            }


            it('#name', function (done) {
                const propertyToTest = 'name';
                testSetGetConstrucEquallity(propertyToTest, (spyCallback) => {
                    return setUpTestModel(spyCallback)
                });
                done();
            })


            it('#surname', function (done) {
                const propertyToTest = 'surname';
                testSetGetConstrucEquallity(propertyToTest, (spyCallback) => {
                    return setUpTestModel(undefined, spyCallback)
                });
                done();
            })


            it('#email', function (done) {
                const propertyToTest = 'email';
                testSetGetConstrucEquallity(propertyToTest, (spyCallback) => {
                    return setUpTestModel(undefined, undefined, spyCallback)
                });
                done();
            })


            it('#address', function (done) {
                const propertyToTest = 'address';
                testSetGetConstrucEquallity(propertyToTest, (spyCallback) => {
                    return setUpTestModel(undefined, undefined, undefined, spyCallback)
                });
                done();
            })


            it('#files', function (done) {
                const propertyToTest = 'files';
                testSetGetConstrucEquallity(propertyToTest, (spyCallback) => {
                    return setUpTestModel(undefined, undefined, undefined, undefined, spyCallback)
                });
                done();
            })

        });
    });
})