const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate fiels value: ${value}. Please use another value! `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => {
    el.message;
  });
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJETError = () =>
  new AppError('Invalid token. please log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendDevError = (err, req, res) => {
  // a) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // b) Rendered Website
  console.error('Error', err);
  return res.status(err.statusCode).render('error', {
    title: 'somtheing went wrong',
    msg: err.message,
  });
};

const sendProError = (err, req, res) => {
  // A) Operational Trusted Error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // b) Programing or other unknown error: don't leak error details
    return res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went very wrong',
    });
  }

  // b) Rendered Website
  // A) Operational Trusted Error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'somtheing went wrong',
      msg: err.message,
    });

    // b) Programing or other unknown error: don't leak error details
  }
  // 1) Log Error
  console.error('Error', err);

  // 2) Send Generic message
  return res.status(err.statusCode).render('error', {
    title: 'somtheing went wrong',
    msg: 'Please Try again Later',
  });
};
// Operational, trusted error: send message to client

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    console.log(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidatorError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJETError();
    if (error.name === 'TokenExpiresError') error = handleJWTExpiredError();
    sendProError(error, req, res);
  }
};
