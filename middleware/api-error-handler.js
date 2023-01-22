/**
 * @param {Object} error
 * @param {Object} req
 * @param {Object} register
 * @param {Object} next
 */

function apiErrorHandler (error, req, res, next) {
  const DEFAULT_STATUS = 'Error'
  const DEFAULT_STATUS_CODE = 500

  const errorStatus = 'Fail'
  const errorStatusCode = error.statusCode
  const errorMessage = error.message

  switch (errorStatusCode) {
    case 400 :
    case 401 :
      res.status(errorStatusCode).json({
        Status: errorStatus,
        Message: errorMessage
      })
      break
    default:
      res.status(DEFAULT_STATUS_CODE).json({
        Status: DEFAULT_STATUS,
        Message: error
      })
  }
  next(error)
}
module.exports = apiErrorHandler
