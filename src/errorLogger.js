const errorLogger = (err, req, res, next) => {
  console.error(err)
  next(err) // calling next middleware
}

const errorResponder = (err, req, res, next) => {
  let statusCode = err.statusCode === undefined ? 500 : err.statusCode,
    message = err.message === undefined ? err : err.message;

  res.header("Content-Type", 'application/json')
  res.status(statusCode).send(JSON.stringify({
    message: message,
    statusCode: statusCode
  }, null, 4)) // pretty print
}

const invalidPathHandler = (req, res, next) => {
  res.status(404).send({
    message: 'Invalid url specified',
    statusCode: 404
  })
}

module.exports = {errorLogger, errorResponder, invalidPathHandler}
