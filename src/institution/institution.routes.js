import { Router } from "express";
import { addInstitution, deleteInstitution, test, updateInstitution, updateInstitutionImage } from "./institution.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { uploadProfilePicture } from '../../middlewares/multer.uploads.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.errors.js'

const api = Router()

api.get('/test', test)
api.post('/add', uploadProfilePicture.single("imageInstitution"), addInstitution)
api.put('/:id', updateInstitution)
api.put('/updateInstitutionImage/:id', [uploadProfilePicture.single('imageInstitution'), deleteFileOnError], updateInstitutionImage)
api.delete('/:id', deleteInstitution)


export default api