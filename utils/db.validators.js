// Validar datos relacionados a la BD

import { isValidObjectId } from 'mongoose'
import User from '../src/user/user.model.js'
import Institution from '../src/institution/institution.model.js'


// Validar existencia de un nombre de usuario (debe ser único para cada usuario)
export const existUsername = async (username, user) => {
  const alreadyUsername = await User.findOne({ username })
  if (alreadyUsername && alreadyUsername._id != user.uid) {
    console.error(`Username ${username} ya existe`)
    throw new Error(`Username ${username} ya existe`)
  }
}

// Validar existencia de un email (debe ser único para cada usuario)
export const existEmail = async (email, user) => {
  const alreadyEmail = await User.findOne({ email })
  if (alreadyEmail && alreadyEmail._id != user.uid) {
    console.error(`Email ${email} ya existe`)
    throw new Error(`Email ${email} ya existe`)
  }
}

// Verificar si el campo no es requerido
export const notRequiredField = (field) => {
  if (field) {
    throw new Error(`${field} is not required`)
  }
}

// Validar que el ID de un usuario exista
export const findUser = async (id) => {
  try {
    const userExist = await User.findById(id)
    if (!userExist) return false
    return userExist
  } catch (err) {
    console.error(err)
    return false
  }
}

// Validar que un ObjectId sea válido
export const objectIdValid = (objectId) => {
  if (!isValidObjectId(objectId)) {
    throw new Error(`The value of field is not a valid ObjectId`)
  }
}


// Validar que el nombre no esté vacío y sea único
export const validateInstitutionName = async (name) => {
  if (!name) {
    throw new Error('Name is required')
  }
  if (name.length > 100) {
    throw new Error("Name can't exceed 100 characters")
  }

  const existingInstitution = await Institution.findOne({ name: name.trim() })
  if (existingInstitution) {
    throw new Error('Institution name must be unique')
  }
}


// Validar el campo type
export const validateInstitutionType = (type) => {
  const allowedTypes = ['EATERS', 'ORPHANAGE', 'ACYL']
  if (!type) {
    throw new Error('Type is required')
  }
  const upperType = type.toUpperCase()
  if (!allowedTypes.includes(upperType)) {
    throw new Error(`Type must be one of: ${allowedTypes.join(', ')}`)
  }
}

// Validar el campo state
export const validateInstitutionState = (state) => {
  const allowedStates = ['REFUSED', 'ACCEPTED', 'EARRING']
  const cleanedState = state?.trim().toUpperCase()
  if (!allowedStates.includes(cleanedState)) {
    throw new Error(`State must be one of: ${allowedStates.join(', ')}`)
  }
}

// Validar que el userId sea un ObjectId válido y exista en la DB
export const validateInstitutionUserId = async (userId) => {
  if (!userId || !isValidObjectId(userId)) {
    throw new Error('User ID is not a valid ObjectId')
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }
}