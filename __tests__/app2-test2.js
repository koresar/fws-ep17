describe('routing', () => {
  const App = require('../app2');
  const {handleNotFound, handleGenericError} = App.compose.methods;

  it('should set status code to 404 when no route found', (done) => {
    handleNotFound({}, {}, (error) => {
      if (!error || error.status !== 404) {
        throw new Error('Error status should be 404');
      }
      done();
    });
  });

  it('should not share error details in responses', () => {
    const req = {app: {get() { return 'production'; }}};
    const res = {locals: {}, status() {}, render() {}};

    handleGenericError(new Error('my unexpected error'), req, res);

    if (res.locals.error instanceof Error) {
      throw Error('Error details were shared in "production" env');
    }
  });

  it('should share error message in responses', () => {
    const req = {app: {get() { return 'production'; }}};
    const res = {locals: {}, status() {}, render() {}};

    handleGenericError(new Error('my unexpected error'), req, res);

    if (res.locals.message !== 'my unexpected error') {
      throw Error('Error message should be shared in "production" env');
    }
  });
});
