const express = require('express');
const router = express.Router();

router.get('/books', (req, res) => {
  res.send([
    {
      id: 1,
      title: 'Star Wars I',
    },
  ]);
});

module.exports = router;
