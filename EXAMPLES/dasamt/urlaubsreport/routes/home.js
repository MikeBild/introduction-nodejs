const { promisify } = require('util');
const { readdir: readdircallback } = require('fs');
const readdir = promisify(readdircallback);
const { readFile: readFileCallback } = require('fs');
const readFile = promisify(readFileCallback);
const express = require('express')
const app = express.Router()

module.exports = app

app.get('/', async (req, res, next) => {
  try {
    const fileNameList = await readdir('data')
    const readFileListAsPromise = fileNameList.map(fileName =>
      readFileWithDefaultValue('data/' + fileName)
    )
    const fileContentList = await Promise.all(readFileListAsPromise)
    const urlaubsReporte = fileContentList
      .map(fileContent => JSON.parse(fileContent))
      .map(urlaubsAntragBestaetigung => ({ ...urlaubsAntragBestaetigung, rest: calculateRest(urlaubsAntragBestaetigung) }));

    res.render('home', { title: 'Urlaubsreport', urlaubsReporte })
  }
  catch (error) {
    next(error)
  };
})

function readFileWithDefaultValue(fileName, defaultValue = '{}') {
  return readFile(fileName).catch(error => defaultValue);
}

function calculateRest({ amount, anzahlProJahr = 30 }) {
  return anzahlProJahr - amount;
}

