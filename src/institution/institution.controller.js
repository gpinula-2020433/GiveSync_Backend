'use strict'
import fs from 'fs';
import path from 'path';
import Institution from '../institution/institution.model.js'
import User from '../user/user.model.js'
import Notification from '../notification/notification.model.js'

//Listar todas las instituciones
export const getAllInstitutions = async (req, res) => {
    try {
        const { limit = 10, skip = 0, state } = req.query
        const filter = {}
        if (state) {
            filter.state = state.toUpperCase()
        }
        const institutions = await Institution.find(filter)
            .skip(Number(skip))
            .limit(Number(limit))
        if (institutions.length === 0) {
            return res.status(404).send({
                success: false,
                message: state 
                    ? `No se encontraron instituciones con estado ${state}`
                    : 'No se encontraron instituciones'
            })
        }
        return res.send({
            success: true,
            message: 'Instituciones encontradas',
            institutions
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            err
        })
    }
}


//Listar institución por Id
export const getInstitutionById = async (req, res) => {
    try {
        const { id } = req.params
        const institution = await Institution.findById(id)
        if (!institution) {
            return res.status(404).send({
                success: false,
                message : 'Institución no encontrada'
            })
        }
        return res.send({
            success: true,
            message: 'Institución encontrada',
            institution
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            succes: false,
            message: 'General error',
            err
        })
    }
}


//Listar mis propias instituciones
export const getMyInstitutions = async (req, res) => {
  try {
    const userId = req.user.uid
    const institutions = await Institution.find({ userId })

    if (institutions.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No se encontraron instituciones para este usuario'
      })
    }

    return res.status(200).send({
      success: true,
      message: 'Instituciones del usuario encontradas',
      institutions
    })
  } catch (err) {
    console.error('Error al obtener instituciones del usuario:', err)
    return res.status(500).send({
      success: false,
      message: 'Error general al obtener instituciones',
      err
    })
  }
}

export const addInstitution = async (req, res) => {
  const data = req.body

  try {
    const userId = req.user.uid

    // Verificar si ya tiene una institución registrada
    const existingInstitution = await Institution.findOne({ userId })
    if (existingInstitution) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una institución registrada, no puedes registrar otra'
      })
    }

    // Manejo de imágenes si hay archivos
    if (req.files && req.files.length > 0) {
      data.imageInstitution = req.files.map(file => file.filename)
    }

    // Crear y guardar institución
    let institution = new Institution({ ...data, userId })
    await institution.save()

    // Popular datos del usuario
    institution = await Institution.findById(institution._id).populate(
      'userId',
      'name surname username email'
    )

    console.log('Institution created', institution.state)

    const io = req.app.get('io')
    io.emit('newInstitution', institution.toObject())

    // Crear notificación de solicitud enviada
    const notification = new Notification({
      userId,
      fromUserId: null, // desde el sistema
      type: 'INSTITUTION',
      message: `Tu solicitud de institución "${institution.name}" ha sido enviada. Gracias.`,
      referenceId: institution._id
    })

    await notification.save()

    // Buscar la notificación completa (aunque no tenga fromUserId)
    const populatedNotification = await Notification.findById(notification._id)
      .populate('fromUserId', 'name username imageUser')

    // Emitir notificación al frontend
    io.emit('addNotification', {
      notification: populatedNotification
    })


    return res.json({
      success: true,
      message: 'Guardado exitosamente',
      institution
    })

  } catch (err) {
    console.error('General error', err)
    return res.status(500).json({
      success: false,
      message: 'Error al guardar institución',
      err
    })
  }
}

export const updateInstitutionState = async (req, res) => {
  try {
    const { id } = req.params
    const { state } = req.body
    const validStates = ['ACCEPTED', 'REFUSED', 'EARRING']

    if (!validStates.includes(state?.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Usa: ACCEPTED, REFUSED o EARRING'
      })
    }

    const institution = await Institution.findByIdAndUpdate(
      id,
      { state: state.toUpperCase() },
      { new: true, runValidators: true }
    )

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institución no encontrada'
      })
    }

    const io = req.app.get('io')

    // Si fue aceptada, actualiza el usuario relacionado
    if (state.toUpperCase() === 'ACCEPTED') {
      const updatedUser = await User.findByIdAndUpdate(
        institution.userId,
        {
          hasInstitution: true,
          institutionId: institution._id
        },
        { new: true }
      )

      // Emitir el usuario actualizado con evento específico
      io.emit('updateUserHasInstitution', updatedUser)
    }

    // Crear notificación al dueño
    const notificationMessage =
      state.toUpperCase() === 'ACCEPTED'
        ? `Tu institución ${institution.name} ha sido aceptada y se ha habilitado la sección "Institución", lo que le permite configurarla y agregar publicaciones.
        `
        : state.toUpperCase() === 'REFUSED'
        ? `Tu institución ${institution.name} ha sido rechazada`
        : `El estado de tu institución | ${institution.name} | ha sido actualizado`

    const notificationData = {
      userId: institution.userId,
      fromUserId: null,
      type: 'INSTITUTION',
      message: notificationMessage,
      referenceId: institution._id
    }

    const notification = new Notification(notificationData)
    await notification.save()

    const populatedNotification = await Notification.findById(notification._id)
      .populate('fromUserId', 'name username imageUser')

    // Emitir la notificación
    io.emit('addNotification', {
      notification: populatedNotification
    })

    // Emitir la actualización de institución (como ya hacías)
    io.emit('updateInstitution', institution.toObject())

    return res.json({
      success: true,
      message: 'Estado actualizado correctamente',
      institution
    })
  } catch (err) {
    console.error('Error al actualizar estado', err)
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar estado',
      err
    })
  }
}


//Actualizar Institución
export const updateInstitution = async(req, res)=>{
    try {
        const {id} = req.params
        const data = req.body
        if ('state' in data) {
            delete data.state
        }
        const update = await Institution.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!update)
            return res.status(404).send(
                {
                    success: false,
                    message: 'Institución no encontrada'
                }
            )
          
          const io = req.app.get('io')
          io.emit('updateInstitution', update.toObject())
        return res.send(
            {
                success: true,
                message: 'Institución encontrada y actualizada',
                update
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}


//Actualizar Imagen de la Institución
export const updateInstitutionImage = async(req, res)=>{
    try{
        const {id} = req.params
        const filenames = req.files.map(file => file.filename)
        const oldInstitution = await Institution.findById(id)

        if(!oldInstitution){
            return res.status(404).send({
                success: false,
                message: 'No se encontró la institución'
            })
        }

        if(oldInstitution.imageInstitution && oldInstitution.imageInstitution.length > 0){
            oldInstitution.imageInstitution.forEach(filename =>{
                const imagePath = path.join('uploads/img/users', filename)
                if (fs.existsSync(imagePath)){
                    fs.unlinkSync(imagePath)
                }
            })
        }

        const update = await Institution.findByIdAndUpdate(
            id,
            {imageInstitution: filenames},
            {new: true}
        )

        const io = req.app.get('io')
        io.emit('updateInstitution', update.toObject())
        return res.send({
            success: true,
            message: 'Institución actualizada correctamente',
            institution : update
        })
    }catch(err){
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

// Eliminar Institución
export const deleteInstitution = async (req, res) => {
  try {
    let { id } = req.params

    const institution = await Institution.findById(id)

    if (!institution) {
      return res.status(404).send({
        success: false,
        message: 'No se encontró la institución'
      })
    }

    // Eliminar imágenes si existen
    if (institution.imageInstitution && institution.imageInstitution.length > 0) {
      institution.imageInstitution.forEach(filename => {
        const imagePath = path.join('uploads/img/users', filename)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      })
    }

    // Eliminar institución
    await Institution.findByIdAndDelete(id)

    // Actualizar usuario relacionado
    const updatedUser = await User.findByIdAndUpdate(
      institution.userId,
      {
        hasInstitution: false,
        institutionId: null
      },
      { new: true }
    )

    const io = req.app.get('io')

    // Emitir evento de eliminación de institución
    io.emit('deleteInstitution', { _id: id })

    // Emitir actualización de usuario (relacionado con institución)
    io.emit('updateUserHasInstitution', updatedUser)


    //--------------
    // Obtener el usuario que hace la acción
      const usuarioId = req.user.uid
      const usuario = await User.findById(usuarioId)

      // Mensaje según el rol del que eliminó
      let message = ''

      if (usuario?.role === 'ADMIN') {
        message = `Un administrador ha eliminado tu institución "${institution.name}" por actividad sospechosa o falta de información suficiente.`
      } else {
        message = `Tu institución "${institution.name}" ha sido eliminada satisfactoriamente.`
      }

      // Crear y guardar la notificación
      const notification = new Notification({
        userId: institution.userId,
        fromUserId: null,
        type: 'INSTITUTION',
        message,
        referenceId: institution._id
      })

      await notification.save()

      // Poblar para enviar al frontend
      const populatedNotification = await Notification.findById(notification._id)
        .populate('fromUserId', 'name username imageUser')

      // Emitir la notificación al cliente correspondiente
      io.emit('addNotification', {
        notification: populatedNotification
      })


    return res.send({
      success: true,
      message: 'Institución eliminada correctamente'
    })
  } catch (err) {
    console.error('General error', err)
    return res.status(500).send({
      success: false,
      message: 'General error',
      err
    })
  }
}

export const getPendingInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find({ state: 'EARRING' })
      .sort({ createdAt: -1 })
      .populate('userId', 'name surname username email imageUser')  // <--- Aquí la población del usuario

    if (institutions.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No pending institutions found'
      })
    }

    return res.send({
      success: true,
      message: 'Pending institutions retrieved successfully',
      institutions
    })
  } catch (err) {
    console.error('Error getting pending institutions:', err)
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
      err
    })
  }
}