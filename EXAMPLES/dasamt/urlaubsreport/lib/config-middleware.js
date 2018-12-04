const DATA_FOLDER = process.env.DATA_FOLDER || 'data'
const PORT = process.env.PORT || 8080

module.exports = {
  PORT,
  configMiddleware
}

function configMiddleware(req, res, next) {
  req.config = {
    DATA_FOLDER,
    PORT
  }
  next()
}

