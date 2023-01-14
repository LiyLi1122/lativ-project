function apiErrorHandler (error, req, res, next) {
  const DEFAULT_STATUS = 'Error'
  const DEFAULT_STATUS_CODE = 500

  const errorStatus = 'error'
  const errorStatusCode = error.statusCode
  const errorMessage = error.message

  switch (errorStatusCode) {
    case 400:
      res.status(errorStatusCode).json({
        status: errorStatus,
        message: errorMessage
      })
      break
    case 401:
      res.status(errorStatusCode).json({
        status: errorStatus,
        message: errorMessage
      })
      break
    case 402:
      res.status(errorStatusCode).json({
        status: errorStatus,
        message: errorMessage
      })
      break
  }
  next(error)
}
module.exports = apiErrorHandler
