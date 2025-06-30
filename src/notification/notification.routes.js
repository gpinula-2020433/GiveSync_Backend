import { Router } from "express"
import {
getAllNotifications,
getNotificationsByUser,
markNotificationAsRead,
deleteNotification
} from "./notification.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js"

const api = Router()

// Obtener todas las notificaciones (solo admin o para pruebas generales)
api.get('/all', [validateJwt], getAllNotifications)

// Obtener notificaciones del usuario autenticado
api.get('/my', [validateJwt], getNotificationsByUser)

// Marcar notificación como leída
api.put('/markAsRead/:id', [validateJwt], markNotificationAsRead)

// Eliminar notificación (solo si pertenece al usuario)
api.delete('/delete/:id', [validateJwt], deleteNotification)

export default api