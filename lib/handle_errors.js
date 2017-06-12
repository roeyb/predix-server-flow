module.exports = function* handleErrors(next) {
  try {
    if (!isProduction) log.info({ req: this.request }, 'request received to route ' + this.path)

    yield next
  } catch(err) {
    if (401 == err.status) {
      this.status = 401;
      this.set('WWW-Authenticate', 'Basic');
      this.body = 'cant haz that';
      return;
    }

    log.error({ err: err, req: this.request }, 'error handling request to ' + this.path)

    this.body = err.stack
    this.status = 500
  }
}
