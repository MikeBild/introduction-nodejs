module.exports = ({ consumers = [], products = [], billings = {} }) => {
  return (req, res, next) => {
    req.store = {
      consumers,
      products,
      billings,
    };

    res.setHeader('X-Foo', 'bar');
    console.log('before');
    next();
    console.log('after');
  };
};
