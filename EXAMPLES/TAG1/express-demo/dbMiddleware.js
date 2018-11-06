module.exports = url => {
  return (req, res, next) => {
    createConnection(url, (error, connection) => {
      req.connection = connection;
      next();
      req.connection.close();
    });
  };
};

function createConnection(url, cb) {
  const connection = {
    get: () => ({ hello: 'world' }),
    close: () => ({}),
  };
  setTimeout(() => {
    cb(null, connection);
  }, 2000);
}
