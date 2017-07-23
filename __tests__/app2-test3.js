describe('server', () => {
  const App = require('../app2');

  it('should call exit process after setImmediate()', (done) => {
    let errorCallback = null;
    let setImmediateCalled = false;
    const MockedApp = App.props({
      http: {
        createServer() {
          return {
            on(event, callback) {
              if (event === 'error') errorCallback = callback;
            },
            listen() {}
          };
        }
      },
      setImmediate(callback) {
        setImmediateCalled = true;
        callback();
      },
      process: {
        env: {},
        exit() {
          if (!setImmediateCalled) {
            throw new Error('setImmediate should have been called');
          }
          done();
        }
      }
    });

    MockedApp(); // setup the server

    errorCallback(); // mimic server error
  });
});
