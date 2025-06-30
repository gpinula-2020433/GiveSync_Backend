'use strict'
import path from 'path'
import Comment from './comment.model.js'
import Notification from '../notification/notification.model.js'
import Publication from '../publication/publication.model.js'
import Institution from '../institution/institution.model.js'
import fs from 'fs'

export const getAllComments = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query
    const comments = await Comment.find()
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    if (comments.length === 0)
      return res.status(404).send({
        success: false,
        message: 'Comentarios no encontrados'
      })

    return res.send({
      success: true,
      message: `Se han encontrado ${comments.length} comentarios`,
      comments
    })
  } catch (err) {
    console.error('Error general', err)
    return res.status(500).send({
      success: false,
      message: 'Error general',
      err
    })
  }
}

export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params
    const comment = await Comment.findById(id)
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    if (!comment) {
      return res.status(404).send({
        success: false,
        message: 'Comentario no encontrado'
      })
    }

    return res.send({
      success: true,
      message: 'Comentario encontrado',
      comment
    })
  } catch (err) {
    console.error('Error general', err)
    return res.status(500).send({
      success: false,
      message: 'Error general',
      err
    })
  }
}

export const addComment = async (req, res) => {
  try {
    const data = req.body
    if (req.file?.filename) {
      data.commentImage = req.file.filename
    }
    data.userId = req.user.uid

    let comment = new Comment(data)
    await comment.save()

    // obtener publicación
    const publication = await Publication.findById(comment.publicationId)

    if (publication) {
      // obtener institución asociada a la publicación
      const institution = await Institution.findById(publication.institutionId)

      if (institution) {
        // notificar al dueño de la institución (usuario de la institución)
        const notificationData = {
          userId: institution.userId,           // receptor
          fromUserId: req.user.uid,             // quien comentó
          type: 'COMMENT',
          message: `Han comentado en tu publicación | ${publication.title}`,
          referenceId: comment._id
        }

        const notification = new Notification(notificationData)
        await notification.save()
      }
    }

    comment = await Comment.findById(comment._id)
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    // Emitir por socket
    const io = req.app.get('io')
    io.emit('addComment', {
      comment,
      publicationId: comment.publicationId._id.toString()
    })

    return res.send({
      success: true,
      message: `Comentario agregado exitosamente`,
      comment
    })
  } catch (err) {
    console.error('Error general', err)
    return res.status(500).send({
      success: false,
      message: 'Error general',
      err
    })
  }
}

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params
    const idUserToUpdate = req.user.uid
    const data = req.body

    // Buscar comentario actual para obtener la imagen anterior
    const commentBeforeUpdate = await Comment.findById(id)
    if (!commentBeforeUpdate) {
      return res.status(404).send({
        success: false,
        message: 'Comentario no encontrado'
      })
    }

    if (idUserToUpdate !== commentBeforeUpdate.userId.toString()) {
      return res.status(403).send({
        success: false,
        message: `${req.user.name} | No puedes actualizar un comentario que no sea tuyo`
      })
    }

    // Si llega una nueva imagen, borrar la anterior
    if (req.file?.filename) {
      data.commentImage = req.file.filename

      // Ruta a la imagen anterior
      const oldImage = commentBeforeUpdate.commentImage
      if (oldImage) {
        const oldImagePath = path.resolve('uploads/img/users', oldImage)
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error al eliminar la imagen anterior:', err)
        })
      }
    }

    // Actualizar comentario con los nuevos datos
    const comment = await Comment.findByIdAndUpdate(id, data, { new: true })
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    // Emitir por socket
    const io = req.app.get('io')
    io.emit('updateComment', {
      comment,
      publicationId: comment.publicationId._id.toString()
    })

    return res.send({
      success: true,
      message: 'Comentario actualizado',
      comment
    })
  } catch (err) {
    console.error('Error general', err)
    return res.status(500).send({
      success: false,
      message: 'Error general',
      err
    })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params

    const commentToDelete = await Comment.findById(id)
    if (!commentToDelete) {
      return res.status(404).send({
        success: false,
        message: 'Comentario no encontrado'
      })
    }

    if (req.user.uid !== commentToDelete.userId.toString()) {
      return res.status(403).send({
        success: false,
        message: `${req.user.name} | No puedes eliminar un comentario que no sea tuyo`
      })
    }

    const publicationId = commentToDelete.publicationId

    if (commentToDelete.commentImage) {
      const imagePath = path.join('uploads/img/users', commentToDelete.commentImage)
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, err => {
          if (err) console.error('Error al eliminar la imagen:', err)
        })
      }
    }

    await Comment.findByIdAndDelete(id)

    const io = req.app.get('io')
    io.emit('deleteComment', {
      commentId: id,
      publicationId: publicationId.toString()
    })

    return res.send({
      success: true,
      message: 'Comentario e imagen eliminados exitosamente'
    })
  } catch (err) {
    console.error('Error general', err)
    return res.status(500).send({
      success: false,
      message: 'Error general',
      err
    })
  }
}


// Traer comentarios por publicación
export const getCommentsByPublication = async (req, res) => {
  try {
    const { publicationId } = req.params
    const comments = await Comment.find({ publicationId })
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    if (comments.length === 0)
      return res.status(404).send({ success: false, message: 'No hay comentarios para esta publicación' })

    return res.send({ success: true, comments })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ success: false, message: 'Error del servidor', err })
  }
}

// Traer comentarios por usuario
export const getCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.params
    const comments = await Comment.find({ userId })
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    if (comments.length === 0)
      return res.status(404).send({ success: false, message: 'No hay comentarios de este usuario' })

    return res.send({ success: true, comments })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ success: false, message: 'Error del servidor', err })
  }
}