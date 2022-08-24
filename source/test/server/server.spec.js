const http = require('http');
const {assert} = require('chai');
const request = require('request');
const sandbox = require("sinon").createSandbox();
const server = require('../../server/server');
const routerAppointment = require('../../server/routes/appointment')
const fs = require("fs");

describe('#Server: server/server.js', function () {
    describe('Unit Tests', function () {

        //Hooks
        // The function passed to before() is called before running the test cases.
        before(function (done) {
            server.module.start().then(done).catch((e) => {
                console.log(e);
                console.log('server.spec.js was not able to start the server');
                done();
            });
        });

        describe('#initiatePlugins', function () {
            afterEach('Teardonw Sandbox', function (done) {
                sandbox.reset();
                done();
            });


            it('If no plugin-directory is existing a new plugin-directory is being created at ./plugin', function (done) {

                //stubing fs.existsSync to return false
                const stubExistsSync = sandbox.stub(fs, 'existsSync');
                stubExistsSync.returns(false);

                // mocking fs.mkdirSync to prevent the creation of an new plugindir.
                const mock = sandbox.mock(fs);
                const mockMkdirSync = mock.expects('mkdirSync');
                mockMkdirSync.once();
                mockMkdirSync.withArgs('./plugins', {recursive: true})

                // calling intiatePlugin() to start the test
                server.module.initiatePlugins();

                //verify that function tried to create directory once
                mockMkdirSync.verify();
                done();
            });
        });

        describe('#validatePluginForInitilation', function () {

            afterEach('Teardown Sandbox', function (done) {
                sandbox.reset();
                done();
            });

            it.skip('Does not accept plugin.js to export any type but function-type (class is of type function) ', function (done) {
                const fakePlugins = {
                    num: sandbox.fake.returns(1),
                    str: sandbox.fake.returns("Hello World"),
                    bool: sandbox.fake.returns(true),
                    symbol: sandbox.fake.returns(Symbol('a')),
                    obj: sandbox.fake.returns(null)
                };

                for (let plugin in fakePlugins) {
                    const testedFunc = server.module.validatePluginJSForInitilation(plugin);
                    assert.equal(testedFunc, false);
                }
                done();
            });


            it('Does accept for plugin.js to execute exports which are of type function. (class is of type function) ', function (done) {
                //const fakePlugin = sandbox.fake.return(() => {})
                //const testedFunc = server.module.validatePluginJSForInitilation(fakePlugin);
                //assert.equal(testedFunc, true);
                done();
            });


            it('Can not find "pathes" property in plugin.js". Methode returns false', function (done) {
                done();
            });

            it('"pathes" property returns a non - object type. Methode returns false', function (done) {
                done();
            });

            it('"pathes" object contains propertie which is not of type function. Methode returns false', function (done) {
                done();
            });

            it('A Function-Object-Property inside "pathes" can not be parameterized with request and response - object. Method returns false', function (done) {
                done();
            });
        });
    });


    // Integration - Tests
    describe('Ingegration Tests', function () {

        // describe('Router Binding: Checks if paths provided by imported routers are accessible ', function () {
        // describe('#Appointment Router', function (){
        //     it.only('responds to /appointment/', function (done) {
        //         const stub = sandbox.stub()
        //
        //         const rootControllerStub = sandbox.stub(rootController, "get",
        //             function(req, res, next){
        //                 res.status(200).json({stubbed: 'data'});
        //             });
        //         request(server)
        //             .get('/')
        //             .expect(200)
        //             .expect({stubbed: 'data'})
        //             .end(done);
        //     });
        // })
        // });
        //     describe('/', function () {
        //         it('should be Hello, Mocha!', function (done) {
        //             http.get('http://localhost:8023', function (response) {
        //                 // Assert the status code.
        //                 assert.equal(response.statusCode, 200);
        //                 let body = '';
        //                 response.on('data', function (d) {
        //                     body += d;
        //                 });
        //                 response.on('end', function () {
        //                     // Let's wait until we read the response, and then assert the body
        //                     // is 'Hello, Mocha!'.
        //                     assert.equal(body, 'Hello, Mocha!');
        //                     done();
        //                 });
        //             });
        //         });
        //     });
    });


});