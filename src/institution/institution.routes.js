import { Router } from "express";
import { addInstitution, deleteInstitution, getAllInstitutions, getInstitutionById, updateInstitution, updateInstitutionImage } from "./institution.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { uploadProfilePicture } from '../../middlewares/multer.uploads.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.errors.js'

const api = Router()

api.get('/all', getAllInstitutions)
api.get('/:id', getInstitutionById)
api.post('/add', [uploadProfilePicture.single("imageInstitution"), deleteFileOnError], addInstitution)
api.put('/update/:id', updateInstitution)
api.put('/updateImage/:id', [uploadProfilePicture.single('imageInstitution'), deleteFileOnError], updateInstitutionImage)
api.delete('/delete/:id', deleteInstitution)


export default api