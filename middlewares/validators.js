// Validar campos en las rutas
import { body } from "express-validator";
import { validateErrors } from "./validate.errors.js";
import { existUsername, existEmail, objectIdValid, notRequiredField} from "../utils/db.validators.js";

export const registerValidator = [
    body('name', 'El nombre no puede estar vacío')
        .notEmpty(),
    body('surname', 'El apellido no puede estar vacío')
        .notEmpty(),
    body('email', 'El correo electrónico no puede estar vacío')
        .notEmpty()
        .isEmail()
        .withMessage('El correo electrónico no es válido')
        .custom(existEmail),
    body('username', 'El nombre de usuario no puede estar vacío')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'La contraseña no puede estar vacía')
        .notEmpty()
        .isStrongPassword()
        .withMessage('La contraseña debe ser más fuerte, debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('rol', 'El rol no puede estar vacío')
        .optional(),
    validateErrors
]

export const updateUserValidator = [
  body('username')
      .optional()
      .notEmpty()
      .toLowerCase()
      .custom((username, { req }) => existUsername(username, req.user)),
  body('email')
      .optional()
      .notEmpty()
      .isEmail()
      .custom((email, { req }) => existEmail(email, req.user)),
  body('password')
      .optional()
      .notEmpty()
      .custom(notRequiredField),
  /* body('profilePicture')
      .optional()
      .notEmpty()
      .custom(notRequiredField), */
  body('role')
      .optional()
      .notEmpty()
      .custom(notRequiredField),
  validateErrors
]

export const passwordVerify = [
  body('newPassword')
      .isStrongPassword()
      .withMessage('La contraseña debe ser fuerte (debe contener al menos una mayúscula, una minúscula, un número y un símbolo)')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres'),
  validateErrors
]
