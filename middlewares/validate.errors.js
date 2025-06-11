import { validationResult } from "express-validator";

export const validateErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const allErrors = errors.array();
    const message = allErrors.map(err => ({ msg: err.msg }));

    //error personalizado que será manejado por deleteFileOnError
    const error = new Error("Validation error");
    error.status = 400
    error.errors = allErrors
    error.messageList = message

    return next(error)
  }

  next()
}
