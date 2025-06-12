// Validar campos en las rutas
import { body } from "express-validator";
import { validateErrors } from "./validate.errors.js";
import { existUsername, existEmail, objectIdValid, notRequiredField, isOwnerOfInstitution} from "../utils/db.validators.js";

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty')
      .notEmpty()
      .withMessage('El correo no puede estar vacío')
      .isEmail()
      .withMessage('El correo electrónico no es válido')
      .custom(existEmail),
    body('username', 'Username cannot be empty')
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

export const addPublicationValidation = [
    body('content', 'Content cannot be empty')
        .notEmpty(),
    body('institutionId', 'Institution cannot be empty')
        .notEmpty()
        .custom((institutionId, {req})=>{
            return isOwnerOfInstitution(institutionId, req.user.uid)
        }),
    validateErrors
]

export const updateUserValidator = [
  body('username')
      .optional() //el paramatro puede o puede no llegar- Si no llega no pasa a las demas
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
  body ('newPassword')
  .isStrongPassword()
  .withMessage('Password must be strong')
  .isLength({min: 8})
  .withMessage('Password need min characters'),
  validateErrors
]
