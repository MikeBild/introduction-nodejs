import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/users/register', (req, res) => {
  console.log(req.body);

  res.send({
    ...req.body,
    ok: 'thx',
  });
});

const instance = app.listen(8080, () =>
  console.log(`Server listen on ${instance.address().port}`)
);
