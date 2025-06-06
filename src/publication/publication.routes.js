import { Router} from "express";
import { addPublication, deletePublication, getAllPublication, getPublicationId, test, updateImagePublication, updatePublicaton } from "./publication.controller.js";
import { uploadProfilePicture } from "../../middlewares/multer.uploads.js";
import { deleteFileOnError} from '../../middlewares/delete.file.on.errors.js'

const api = Router()

api.get('/test', test)
api.get('/list', getAllPublication)
api.get('/:id', getPublicationId)
api.post('/add', [uploadProfilePicture.single('imagePublication'), deleteFileOnError],addPublication)
api.put('/update/:id', updatePublicaton)
api.put('/updateImage/:id', [uploadProfilePicture.single('imagePublication'), deleteFileOnError],updateImagePublication)
api.delete('/delete/:id', deletePublication)

export default api