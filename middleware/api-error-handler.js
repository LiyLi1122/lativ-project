/**
 * @param {Object} error
 * @param {Object} req
 * @param {Object} register
 * @param {Object} next
 */

function apiErrorHandler (error, req, res, next) {
  try {
    const defaultStatusCode = 500
    const errorStatusCode = error.statusCode
    const errorMessage = error.message

    switch (errorStatusCode) {
      case 400:
      case 401:
        res.status(errorStatusCode).json({
          Message: errorMessage
        })
        break
      default:
        res.status(defaultStatusCode).json({
          Message: error
        })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}
module.exports = apiErrorHandler
