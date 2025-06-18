// Validar datos relacionados a la BD

import { isValidObjectId } from 'mongoose'
import User from '../src/user/user.model.js'
import Publication from '../src/publication/publication.model.js'
import Institution from '../src/institution/institution.model.js'


// Validar existencia de un nombre de usuario (debe ser único para cada usuario)
export const existUsername = async (username, user) => {
  const alreadyUsername = await User.findOne({ username })
  if (alreadyUsername && alreadyUsername._id != user.uid) {
    console.error(`El nombre de usuario ${username} ya existe`)
    throw new Error(`El nombre de usuario ${username} ya existe`)
  }
}

// Validar existencia de un email (debe ser único para cada usuario)
export const existEmail = async (email, user) => {
  const alreadyEmail = await User.findOne({ email })
  if (alreadyEmail && alreadyEmail._id != user.uid) {
    console.error(`El correo electrónico ${email} ya existe`)
    throw new Error(`El correo electrónico ${email} ya existe`)
  }
}

// Verificar si el campo no es requerido
export const notRequiredField = (field) => {
  if (field) {
    throw new Error(`${field} no es requerido`)
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

// Validar que el ID de una publicacion exista
export const findPublication = async (id) => {
  try {
    const publicatonExist = await Publication.findById(id)
    if (!publicatonExist) return false
    return publicatonExist
  } catch (err) {
    console.error(err)
    return false
  }
}

// Validar que el ID de una institucion exista
export const findInstitution = async (id) => {
  try {
    const institutionExist = await Institution.findById(id)
    if (!institutionExist) return false
    return institutionExist
  } catch (err) {
    console.error(err)
    return false
  }
}

// Validar que un ObjectId sea válido
export const objectIdValid = (objectId) => {
  if (!isValidObjectId(objectId)) {
    throw new Error(`El valor del campo no es un ObjectId válido`)
  }
}

//Validar si el usuario registrado es dueño de la instutición para poder hacer una publicación
export const isOwnerOfInstitution = async(institutionId, userId) =>{
  const institution = await Institution.findById(institutionId)
  if(!institution){
    throw new Error('No se encontro la institución')
  }

  console.log('ID de usuario autenticado:', userId)
  console.log('ID del dueño de la institución:', institution.userId.toString())

  if(institution.userId.toString() !== String(userId)){
    throw new ('No tienes permiso para agregar publicaciones a está institución')
  }

  return true
}

////Validar si el usuario registrado es dueño de la instutición para poder editar o eliminar una publicación
export const isOwnerOfPublication = async (req, res, next) => {
  try {
    const publication = await Publication.findById(req.params.id).populate('institutionId')
    if(!publication){
      return res.status(404).json({message: 'No se encontro la publicación'})
    }

    const institution = publication.institutionId

    console.log('ID de usuario en publicación:', req.user.uid)
    console.log('ID del dueño de la institución:', institution.userId.toString())

    if (publication.institutionId.userId.toString() !== req.user.uid){
      return res.status(403).json({message: 'No tienes permiso para modicar está publicación'})
    }

    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: 'Internal server error'})
  }
}

//Validar que si exista la Institucion
export const existInstitution = async (id) => {
  if (!id) throw new Error('El ID de la institución es obligatorio')
  try {
    const institution = await Institution.findById(id)
    if (!institution) {
      throw new Error('Institución no encontrada')
    }
    return true
  } catch (err) {
    throw new Error(err.message || 'Error al verificar la institución')
  }
}


//Validar el nombre de la institución
export const validateInstitutionName = async (name, currentId = null) => {
  if (!name) {
    throw new Error('El nombre es obligatorio')
  }
  if (name.length > 100) {
    throw new Error("El nombre no puede exceder los 100 caracteres")
  }
  const existingInstitution = await Institution.findOne({ name: name.trim() })
  if (existingInstitution) {
    if (!currentId || existingInstitution._id.toString() !== currentId) {
      throw new Error('El nombre de la institución ya existe')
    }
  }
}


// Validar el campo type
export const validateInstitutionType = (type) => {
  const allowedTypes = ['EATERS', 'ORPHANAGE', 'ACYL']
  if (!type) {
    throw new Error('El tipo de institución es obligatorio')
  }
  const upperType = type.toUpperCase()
  if (!allowedTypes.includes(upperType)) {
    throw new Error(`El tipo debe ser uno de: ${allowedTypes.join(', ')}`)
  }
}

// Validar el campo state
export const validateInstitutionState = (state) => {
  const allowedStates = ['REFUSED', 'ACCEPTED', 'EARRING']
  const cleanedState = state?.trim().toUpperCase()
  if (!allowedStates.includes(cleanedState)) {
    throw new Error(`El estado debe ser uno de: ${allowedStates.join(', ')}`)
  }
}

// Validar que el userId sea un ObjectId válido y exista en la DB
export const validateInstitutionUserId = async (userId) => {
  if (!userId || !isValidObjectId(userId)) {
    throw new Error('El ID de usuario no es un ObjectId válido')
  }

  const user = await User.findById(userId)
  if (!user) {
    throw new Error('Usuario no encontrado')
  }
}


//Validar que solo el dueño de la institución pueda editarla y eliminarla 
export const ValidateIsInstitutionOwner = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.uid
    const institution = await Institution.findById(id)
    if (!institution) {
      return res.status(404).json({ message: 'Institución no encontrada' })
    }
    if (institution.userId.toString() !== userId) {
      return res.status(403).json({ message: 'No estás autorizado para realizar esta acción.' })
    }
    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}