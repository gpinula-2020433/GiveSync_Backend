'use strict'

import Notification from './notification.model.js'

export const test = async (req, res) => {
  return res.send('The notification connection is running')
}

// Obtener todas las notificaciones (opcional paginación)
export const getAllNotifications = async (req, res) => {
  const { limit, skip } = req.query
  try {
    const notifications = await Notification.find()
      .skip(skip)
      .limit(limit)
      .populate('userId')
      .populate('fromUserId', 'name username')
      .populate('referenceId')

    if (notifications.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No se encontraron notificaciones'
      })
    }

    return res.send({
      success: true,
      notificationsLength: notifications.length,
      message: 'Notificaciones encontradas',
      notifications
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

// Obtener notificaciones de un usuario en particular
export const getNotificationsByUser = async (req, res) => {
  const userId = req.user.uid
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name username')
      .populate('fromUserId', 'name username')
      .populate('referenceId')

      if (notifications.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No tienes notificaciones'
      })
    }

    return res.send({
      success: true,
      notificationsLength: notifications.length,
      notifications
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

// Obtener notificación por ID
export const getNotificationById = async (req, res) => {
  const { id } = req.params
  try {
    const notification = await Notification.findById(id)
      .populate('userId', 'name username')
      .populate('fromUserId', 'name username')
      .populate('referenceId')

    if (!notification) {
      return res.status(404).send({
        success: false,
        message: 'No se encontró la notificación'
      })
    }

    return res.send({
      success: true,
      notification
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

// Crear notificación
export const addNotification = async (req, res) => {
  const data = req.body
  try {
    // quien origina la notificación
    data.fromUserId = req.user.uid

    const notification = new Notification(data)
    await notification.save()

    return res.send({
      success: true,
      message: 'Notificación creada correctamente'
    })
  } catch (error) {
    console.error('Error creando notificación', error)
    return res.status(400).send({
      success: false,
      message: error.message || 'Error creando la notificación',
      error
    })
  }
}

// Marcar como leída
export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params
  const userId = req.user.uid // Usuario autenticado

  try {
    // Buscar la notificación por ID
    const notification = await Notification.findById(id)

    if (!notification) {
      return res.status(404).send({
        success: false,
        message: 'No se encontró la notificación'
      })
    }

    // Verificar si la notificación pertenece al usuario autenticado
    if (notification.userId.toString() !== userId) {
      return res.status(403).send({
        success: false,
        message: 'No tienes permiso para marcar esta notificación como leída'
      })
    }

    // Marcar la notificación como leída
    notification.isRead = true
    await notification.save()

    return res.send({
      success: true,
      message: 'Notificación marcada como leída',
      notification
    })
  } catch (error) {
    console.error('Error marcando como leída', error)
    return res.status(500).send({
      success: false,
      message: 'Error marcando como leída',
      error
    })
  }
}


// Eliminar notificación
export const deleteNotification = async (req, res) => {
  const { id } = req.params
  const userId = req.user.uid // Usuario autenticado

  try {
    // Buscar la notificación por ID
    const notification = await Notification.findById(id)

    if (!notification) {
      return res.status(404).send({
        success: false,
        message: 'No se encontró la notificación'
      })
    }

    // Verificar si la notificación pertenece al usuario autenticado
    if (notification.userId.toString() !== userId) {
      return res.status(403).send({
        success: false,
        message: 'No tienes permiso para eliminar esta notificación'
      })
    }

    // Eliminar la notificación
    await Notification.findByIdAndDelete(id)

    return res.send({
      success: true,
      message: 'Notificación eliminada correctamente'
    })
  } catch (error) {
    console.error('Error eliminando', error)
    return res.status(500).send({
      success: false,
      message: 'Error eliminando la notificación',
      error
    })
  }
}
