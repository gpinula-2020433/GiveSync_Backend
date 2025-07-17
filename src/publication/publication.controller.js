'use strict'

import Publication from './publication.model.js'
import Institution from '../institution/institution.model.js'
import Comment from '../comment/comment.model.js'
import path from 'path'
import fs from 'fs'

export const test = async (req, res) => {
  return res.send('The publication connection is running')
}

// List all publications
export const getAllPublication = async (req, res) => {
  const { limit, skip } = req.query
  try {
    const publication = await Publication.find()
      .skip(skip)
      .limit(limit)

    if (publication.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No se encontró la publicación'
      })
    }
    return res.send({
      success: true,
      message: 'Publicaciones encontradas:',
      publication
    })
  } catch (error) {
    console.error('General error', error)
    return res.status(500).send({
      success: false,
      message: 'General error',
      error
    })
  }
}

export const getPublicationId = async (req, res) => {
  try {
    let { id } = req.params
    const publication = await Publication.findById(id)

    if (!publication)
      return res.status(404).send({
        success: false,
        message: 'No se encontró la publicación'
      })

    return res.send({
      success: true,
      message: 'Publicación encontrada:',
      publication
    })
  } catch (error) {
    console.error('Error general', error)
    return res.status(500).send({
      success: false,
      message: 'Error general',
      error
    })
  }
}

// Obtener publicaciones por institución
export const getPublicationsByInstitution = async (req, res) => {
  try {
    const { institutionId } = req.params

    const institutionExist = await Institution.findById(institutionId)

    if(!institutionExist){
      return res.status(404).send({
        success:false,
        message: `La institución con id ${institutionId} no existe`
      })
    }

    const publications = await Publication.find({ institutionId })

    if (publications.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No se encontraron publicaciones para esta institución'
      })
    }

    return res.send({
      success: true,
      message: `Publicaciones de la institución ${institutionId}: `,
      publications
    })
  } catch (error) {
    console.error('Error al obtener publicaciones por institución', error)
    return res.status(500).send({
      success: false,
      message: 'Error general',
      error
    })
  }
}

// Guardar publicaciones
export const addPublication = async (req, res) => {
  const data = req.body
  try {
    if (req.files && req.files.length > 0) {
      data.imagePublication = req.files.map(file => file.filename)
    }

    let publication = new Publication(data)
    await publication.save()

    const io = req.app.get('io')
    io.emit('newPublication', {
      publication: publication.toObject(),
      institutionId: publication.institutionId.toString()
    })

    return res.status(200).send({ 
      message: 'Publicación agregada correctamente',
      publication
    })
  } catch (error) {
    console.error(error)
    return res.status(400).send({
      success: false,
      message: error.message || 'Error agregando la publicación'
    })
  }
}

export const updatePublicaton = async (req, res) => {
  try {
    let { id } = req.params
    let data = req.body

    const update = await Publication.findByIdAndUpdate(id, data, { new: true })

    if (!update)
      return res.status(404).send({
        success: false,
        message: 'No se encontró la publicación'
      })

    const io = req.app.get('io')
    io.emit('updatePublication', {
      publication: update.toObject(),
      institutionId: update.institutionId.toString()
    })

    return res.send({
      success: true,
      message: 'Publicación actualizada correctamente',
      update
    })
  } catch (error) {
    console.error(error)
    return res.status(400).send({
      success: false,
      message: error.message || 'Error al actualizar la publicación'
    })
  }
}

export const updateImagePublication = async (req, res) => {
  try {
    const { id } = req.params
    const filenames = req.files.map(file => file.filename)

    const oldPublication = await Publication.findById(id)

    if (!oldPublication) {
      return res.status(404).send({
        success: false,
        message: 'No se encontró la publicación'
      })
    }

    if (oldPublication.imagePublication && oldPublication.imagePublication.length > 0) {
      oldPublication.imagePublication.forEach(filename => {
        const imagePath = path.join('uploads/img/users', filename)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      })
    }

    const update = await Publication.findByIdAndUpdate(id, { imagePublication: filenames }, { new: true })

    const io = req.app.get('io')
    io.emit('updatePublication', {
      publication: update.toObject(),
      institutionId: update.institutionId.toString()
    })

    return res.send({
      success: true,
      message: 'Publicación actualizada correctamente',
      publication: update
    })
  } catch (error) {
    console.error('Error general', error)
    return res.status(500).send({
      success: false,
      message: 'Error actualizando imágenes',
      error
    })
  }
}

export const deletePublication = async (req, res) => {
  try {
    const { id } = req.params

    const publication = await Publication.findById(id)

    if (!publication) {
      return res.status(404).send({
        success: false,
        message: 'No se encontró la publicación'
      })
    }

    if (publication.imagePublication && publication.imagePublication.length > 0) {
      publication.imagePublication.forEach(filename => {
        const imagePath = path.join('uploads/img/users', filename)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      })
    }

    // Eliminar comentarios relacionados
    await Comment.deleteMany({ publicationId: id })

    // Eliminar la publicación
    await Publication.findByIdAndDelete(id)

    const io = req.app.get('io')

    io.emit('deletePublication', {
      publicationId: id,
      institutionId: publication.institutionId.toString()
    })

    return res.send({
      success: true,
      message: 'Eliminado correctamente'
    })
  } catch (error) {
    console.error('Error general', error)
    return res.status(500).send({
      success: false,
      message: 'Error general',
      error
    })
  }
}
