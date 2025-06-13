'use strict'
import path from 'path'
import Comment from './comment.model.js'
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
      message: 'Comentarios encontrados',
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

    comment = await Comment.findById(comment._id)
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

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
    const { id } = req.params;
    let data = req.body;

    // Buscar comentario actual para obtener la imagen anterior
    let commentBeforeUpdate = await Comment.findById(id);
    if(req.user.uid != commentBeforeUpdate.userId){
      return res.send(
          {
              success: false,
              message: `${req.user.name} | No puedes actualizar un comentario que no sea tuyo`
          }
      )
  }


    if (!commentBeforeUpdate) {
      return res.status(404).send({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    // Si llega una nueva imagen, borrar la anterior
    if (req.file?.filename) {
      data.commentImage = req.file.filename;

      // Ruta a la imagen anterior
      const oldImage = commentBeforeUpdate.commentImage;
      if (oldImage) {
        const oldImagePath = path.resolve('uploads/img/users', oldImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error al eliminar la imagen anterior:', err);
        });
      }
    }

    
    // Actualizar comentario con los nuevos datos
    const comment = await Comment.findByIdAndUpdate(id, data, { new: true })
      .populate('userId', 'name email')
      .populate('publicationId', 'title');

    return res.send({
      success: true,
      message: 'Comentario actualizado',
      comment
    });
  } catch (err) {
    console.error('Error general', err);
    return res.status(500).send({
      success: false,
      message: 'Error general',
      err
    });
  }
};

// DELETE - Eliminar comentario
export const deleteComment = async (req, res) => {
  try {
    let { id } = req.params;
    
    let commentToDelete = await Comment.findById(id);
    if (req.user.uid != commentToDelete.userId) {
      return res.send({
        success: false,
        message: `${req.user.name} | No puedes eliminar un comentario que no sea tuyo`
      });
    }

    // Eliminar imagen si existe
    if (commentToDelete.commentImage) {
      const imagePath = path.join('uploads/img/users', commentToDelete.commentImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Elimina el archivo
      }
    }

    let comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).send({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    return res.send({
      success: true,
      message: 'Comentario e imagen eliminados exitosamente'
    });
  } catch (err) {
    console.error('Error general', err);
    return res.status(500).send({
      success: false,
      message: 'Error general',
      err
    });
  }
};



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
