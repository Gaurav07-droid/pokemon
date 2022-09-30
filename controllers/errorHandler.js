const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "errro",
      message: "Internal server error",
    });
  }
};

const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
  });
};

const globalErrorHadler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "production") {
    sendErrorProd(err, res);
  }
};

module.exports = globalErrorHadler;
