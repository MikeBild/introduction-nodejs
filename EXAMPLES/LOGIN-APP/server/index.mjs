import express from 'express';

const app = express();
app.use(express.json());

app.post('/user/register', (req, res) => {
  console.log(req.body);

  res.send({
    ...req.body,
    ok: 'thx',
  });
});

const instance = app.listen(8080, () =>
  console.log(`Server listen on ${instance.address().port}`)
);