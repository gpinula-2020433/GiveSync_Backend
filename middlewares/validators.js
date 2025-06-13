// Validar campos en las rutas
import { body } from "express-validator";
import { isValidObjectId } from 'mongoose'
import { validateErrors } from "./validate.errors.js";
import { existUsername, existEmail, objectIdValid, notRequiredField, isOwnerOfInstitution, existInstitution,findUser, validateInstitutionName, validateInstitutionType, validateInstitutionState, validateInstitutionUserId, findUser, findPublication} from "../utils/db.validators.js";

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

export const updateCommentV = [
    body('content', 'Content cannot be empty')
        .notEmpty(),
        body('userId')
        .optional()
        .custom(findUser),
    body('publicationId')
        .optional()
        .custom(findPublication),
    validateErrors
]

export const addCommentV = [
    body('content', 'Content cannot be empty')
        .notEmpty()
        .withMessage('Content cannot be Empty')
        .isLength({ max: 500 })
        .withMessage('Content cannot exceed 500 characters'),
    body('userId')
        .optional()
        .custom(findUser),
    body('publicationId')
        .optional()
        .custom(findPublication),
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

export const donationValidator = [
    body('amount')
      .notEmpty()
      .withMessage('El monto es obligatorio')
      .isFloat({ gt: 0, lt: 1000000 })
      .withMessage('El monto debe estar entre 1 y 1,000,000'),
    body('institution')
      .notEmpty()
      .withMessage('La institución es obligatoria')
      .custom(existInstitution),
    body('user')
      .notEmpty()
      .withMessage('El usuario es obligatorio')
      .custom(findUser),
    validateErrors
  ]

//Validación al agregar Institución
export const validateCreateInstitution = [
    body('name', 'Invalid name')
        .notEmpty()
        .custom(async (value) => {
        await validateInstitutionName(value)
        }),
    body('type', 'Invalid type')
        .notEmpty()
        .custom((value) => {
        validateInstitutionType(value)
        return true
        }),
    body('description', 'Description is required')
        .notEmpty()
        .isLength({ max: 150 })
        .withMessage('Description can’t exceed 150 characters'),
    body('state', 'Invalid state')
        .optional()
        .custom((value) => {
        validateInstitutionState(value)
        return true
        }),
    body('userId', 'Invalid user ID')
        .notEmpty()
        .custom(async (value) => {
        if (!isValidObjectId(value)) {
            throw new Error('User ID is not a valid ObjectId')
        }
        await validateInstitutionUserId(value)
        }),
    validateErrors
]


//Validación al actualizar Institución
export const validateUpdateInstitution = [
    body('name', 'Invalid name')
        .optional()
        .custom(async (value) => {
        await validateInstitutionName(value)
        }),
    body('type', 'Invalid type')
        .optional()
        .custom((value) => {
        validateInstitutionType(value)
        return true
        }),
    body('description', 'Description is required')
        .optional()
        .isLength({ max: 150 })
        .withMessage('Description can’t exceed 150 characters'),
    body('state', 'Invalid state')
        .optional()
        .custom((value) => {
        validateInstitutionState(value)
        return true
        }),
    body('userId', 'Invalid user ID')
        .optional()
        .custom(async (value) => {
        if (!isValidObjectId(value)) {
            throw new Error('User ID is not a valid ObjectId')
        }
        await validateInstitutionUserId(value)
        }),
    validateErrors
]