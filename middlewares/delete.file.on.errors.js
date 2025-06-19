//Eliminar archivos si algo sale mal
import { unlink } from 'fs/promises' //Eliminar archivos
import { join } from 'path'

//Middleware para eliminar archivos en caso de error
export const deleteFileOnError = async (error, req, res, next) => {
  if (req.file && req.filePath) {
    const filePath = join(req.filePath, req.file.filename);
    try {
      await unlink(filePath);
    } catch (unlinkErr) {
      console.error('Error al eliminar el archivo', unlinkErr);
    }
  }

  //Si es un error de validación
  if (error.status === 400 || error.errors) {
    return res.status(400).send(
      {
        success: false,
        errors: error.errors || [],
        message: error.messageList || [{ msg: error.message }]
      }
    )
  }

  //Otro tipo de error
  return res.status(500).send(
    {
      success: false,
      message: error.message || 'Error interno del servidor'
    }
  )
}
