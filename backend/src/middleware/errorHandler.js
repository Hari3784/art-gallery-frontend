export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found' })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  const statusCode = error.statusCode || 500
  return res.status(statusCode).json({
    message: error.message || 'Server error',
  })
}
