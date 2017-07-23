describe('express app setup', () => {
  const App = require('../app2').props({
    http: {
      createServer() {
        return {on() {}, listen() {}};
      }
    }
  });

  it('should share ./public', (done) => {
    const express = () => ({set() {}, use() {}});
    express.static = (path) => {
      if (path.endsWith('/public')) {
        done();
      }
    };
    const MockedApp = App.props({express});

    MockedApp();
  });

  it('should not share non ./public', () => {
    const express = () => ({set() {}, use() {}});
    express.static = (path) => {
      if (!path.endsWith('/public')) {
        throw new Error('Should not share non public files');
      }
    };
    const MockedApp = App.props({express});

    MockedApp();
  });

  it('should set urlencoded external=false', (done) => {
    const bodyParser = {
      json() { return () => {}; },
      urlencoded({extended}) {
        if (extended !== false) {
          throw new Error('urlencoded extended option must be false');
        }
        done();
        return () => {};
      }
    };
    const MockedApp = App.props({bodyParser});

    MockedApp();
  });
});
