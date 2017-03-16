module.exports = {
  basicAuth: basicAuth,
};

function basicAuth () {
  return (req, res, next) => {
    if(!req.headers.authorization) return res.status(401).send({error: 'Login please'});

    const authSignature = Buffer.from(req.headers.authorization.replace('Basic', '').trim(), 'base64').toString('utf-8');
    const authSplit = authSignature.split(':');

    const username = authSplit[0];
    const password = authSplit[1];

    if(!(username && password)) return res.status(401).send({error: 'Username or password missing'});
    if(!(username === process.env.MYAPP_USERNAME && password === process.env.MYAPP_PASSWORD)) return res.status(401).send({error: 'Username or password wrong'});

    req.currentUser = {
      username: username,
      role: 'admin',
      profile: {
        age: 22,
      },
    };
    // async example
    // db.query(username).then(data => data.password === PASSWORD).then(data => data ? next() : res.sendStatus(401)))
    next();
  };
}