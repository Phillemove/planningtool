const {assert} = require('chai');
const addressModel = require('../../models/Adress');
const sandbox = require('sinon').createSandbox();

// NOTE!!: this test uses the same design which can be found in contact.spec.js. This test could also be applied to
// any other model with only slight changes to the given Parameter. This is due to the generic / dynamic way this tests
// operate. This enables to achive a very high testing coverage with as little effort as possible. This could be further
// utilized to automate the whole process of applying this test to any model added to the project.

// NOTE: since all properties are private we can not spy on them directly and have to use this devious approach
// Since this is just a model - we mainly test to make sure that the set of operation which can be performed on a
// property all work on the same property.

describe('#Address Model: test/model/adress.spec.js', function () {

    afterEach(function (done) {
        sandbox.restore();
        done();
    });

    // sets up Model with default parameters, which can specified
    function setUpTestModel(houseNumber = "41", street = "Dummystreet", location = sandbox.spy()) {
        const address = new addressModel(houseNumber, street, location);
        return {address, params: {houseNumber, street, location}}; // allows for accessing spies and other defaultvalues
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
                ;

                // setup spy which will be passe as argument -> since all properties are private we can not spy on them directly
                const spyCallback1 = sandbox.spy()
                // spyCallback has to be placed at the right position in setUpFunc. that is why we use a wraper / dependency Injection
                const {address} = setUpFunc(spyCallback1);

                // get und constructor access same Value
                assert.equal(address[propToTestAsString], spyCallback1);
                assert.isTrue(spyCallback1.notCalled); // is not supposed to manipulateValue

                // set und get access same value
                const spyCallback2 = sandbox.spy()
                address[propToTestAsString] = spyCallback2;
                assert.equal(address[propToTestAsString], spyCallback2);
            }


            it('#houseNumber', function (done) {
                const propertyToTest = 'houseNumber';
                testSetGetConstrucEquallity(propertyToTest, (spyCallback) => {
                    return setUpTestModel(spyCallback)
                });
                done();
            })


            it('#street', function (done) {
                const propertyToTest = 'street';
                testSetGetConstrucEquallity(propertyToTest, (spyCallback) => {
                    return setUpTestModel(undefined, spyCallback)
                });
                done();
            })


            it('#location', function (done) {
                const propertyToTest = 'location';
                testSetGetConstrucEquallity(propertyToTest, (spyCallback) => {
                    return setUpTestModel(undefined, undefined, spyCallback)
                });
                done();
            })
        });
    });
});