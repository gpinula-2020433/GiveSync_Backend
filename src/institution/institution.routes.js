import { Router } from "express";
import { addInstitution, 
         deleteInstitution, 
         getAllInstitutions, 
         getInstitutionById,
        updateInstitution, 
        updateInstitutionImage } from "./institution.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { uploadMultipleInstitutionImages } from '../../middlewares/multer.uploads.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.errors.js'
import { validateCreateInstitution, validateUpdateInstitution } from "../../middlewares/validators.js";
import { ValidateIsInstitutionOwner } from "../../utils/db.validators.js";

const api = Router()

api.get('/all', getAllInstitutions)
api.get('/:id', validateJwt , getInstitutionById)
api.post('/add', [uploadMultipleInstitutionImages, deleteFileOnError, validateCreateInstitution, validateJwt], addInstitution)
api.put('/update/:id', [validateJwt, ValidateIsInstitutionOwner, validateUpdateInstitution] ,updateInstitution)
api.put('/updateImage/:id', [validateJwt, ValidateIsInstitutionOwner, uploadMultipleInstitutionImages, deleteFileOnError], updateInstitutionImage)
api.delete('/delete/:id', [validateJwt, ValidateIsInstitutionOwner] , deleteInstitution)


export default api