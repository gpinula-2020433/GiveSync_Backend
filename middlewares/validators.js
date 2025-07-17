// Validar campos en las rutas
import { body } from "express-validator";
import { isValidObjectId } from 'mongoose'
import { param } from "express-validator";
import { validateErrors } from "./validate.errors.js";
import { existUsername, existEmail, notRequiredField, isOwnerOfInstitution, existInstitution, findUser, findPublication, validateInstitutionName, validateInstitutionType, validateInstitutionState, validateInstitutionUserId} from "../utils/db.validators.js";

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

export const addPublicationValidation = [
    body('title', 'El titulo no puede estar vacío')
        .notEmpty()
        .isLength({ max: 15 })
        .withMessage('El título no puede tener más de 15 caracteres'),
    body('content', 'El contenido no puede estar vacío')
        .notEmpty(),
    body('institutionId', 'La intitución no puede estar vacía')
        .notEmpty()
        .custom((institutionId, {req})=>{
            return isOwnerOfInstitution(institutionId, req.user.uid)
        }),
    validateErrors
]

export const updatePublicationValidation = [
    body('title', 'El titulo no puede estar vacío')
        .notEmpty()
        .isLength({ max: 15 })
        .withMessage('El título no puede tener más de 15 caracteres'),
    body('content', 'El contenido no puede estar vacío')
        .notEmpty(),
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

export const getCommentsByPublicationV = [
    param('publicationId')
        .isMongoId()
        .withMessage('id de la publicacion invalida'),
    validateErrors
]


export const getCommentsByUserV = [
    param('userId')
        .isMongoId()
        .withMessage('ID del usuario invalido'),
    validateErrors
]



export const updateUserValidator = [
    body('name', 'El nombre no puede estar vacío')
        .optional()
        .notEmpty(),
    body('surname', 'El apellido no puede estar vacío')
        .optional()
        .notEmpty(),
    body('email')
        .optional()
        .notEmpty()
        .isEmail()
        .withMessage('El correo electrónico no es válido')
        .custom(existEmail),
    body('username')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password')
        .optional()
        .custom(notRequiredField),
    body('imageUser')
        .optional()
        .custom(notRequiredField),
    body('role')
        .optional()
        .custom(notRequiredField),
    validateErrors
]

export const passwordVerify = [
    body('currentPassword')
        .notEmpty()
        .withMessage('La contraseña actual es obligatoria'),
  body('newPassword')
        .notEmpty()
        .withMessage('La nueva contraseña es obligatoria')
      .isStrongPassword()
      .withMessage('La contraseña debe ser fuerte (debe contener al menos una mayúscula, una minúscula, un número y un símbolo)')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres'),
  validateErrors
]

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
        .isLength({ max: 1000 })
        .withMessage('Description can’t exceed 150 characters'),
    body('address', 'Address is required')
        .notEmpty()
        .isLength({ max: 150 })
        .withMessage('Address can’t exceed 150 characters'),
    body('phone', 'Phone is required')
        .notEmpty()
        .isMobilePhone()
        .withMessage('Phone must be a valid mobile phone number'),
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
    validateErrors
]

export const validateUpdateInstitution = [
  body('name')
    .optional()
    .custom(async (value, { req }) => {
      await validateInstitutionName(value, req.params.id)
    }),
  body('type')
    .optional()
    .custom((value) => {
      validateInstitutionType(value)
      return true
    }),
  body('description', 'Description is required')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description can’t exceed 150 characters'),
  body('address', 'Address is required')
    .optional()
    .isLength({ max: 150 })
    .withMessage('Address can’t exceed 150 characters'),
  body('phone', 'Phone is required')
    .optional()
    .isMobilePhone()
    .withMessage('Phone must be a valid mobile phone number'),
 body('state', 'Invalid state')
    .optional()
    .custom(notRequiredField),
  validateErrors
]

export const donationValidator = [
    body('amount')
      .notEmpty()
      .withMessage('El monto es obligatorio')
      .isFloat()
      .withMessage('El monto debe ser un número válido')
      .isFloat({ gt: 0, lt: 1000000 })
      .withMessage('El monto debe estar entre 1 y 1,000,000'),
    body('institution')
      .notEmpty()
      .withMessage('La institución es obligatoria')
      .custom(existInstitution),
    validateErrors
]