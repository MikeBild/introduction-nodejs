module.exports = (consumers = []) => {
  return (req, res, next) => {
    req.store = {
      consumers,
    };
    res.setHeader('X-Foo', 'bar');
    console.log('before');
    next();
    console.log('after');
  };
};
