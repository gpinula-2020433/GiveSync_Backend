// Validar campos en las rutas
import { body } from "express-validator";
import { validateErrors } from "./validate.errors.js";
import { existUsername, existEmail, objectIdValid} from "../utils/db.validators.js";

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('email')
      .notEmpty()
      .withMessage('El correo no puede estar vacío')
      .isEmail()
      .withMessage('El correo electrónico no es válido')
      .custom(existEmail),
    body('username')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('La contraseña debe ser más fuerte, debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.')
        .isLength({min: 8})
        .withMessage('Password need min characters'),
      body('rol', 'Role cannot be empty')
        .optional(),
    validateErrors
]

export const passwordVerify = [
  body ('newPassword')
  .isStrongPassword()
  .withMessage('Password must be strong')
  .isLength({min: 8})
  .withMessage('Password need min characters'),
  validateErrors
]
