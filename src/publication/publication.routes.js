import { Router} from "express";
import { addPublication, deletePublication, getAllPublication, getPublicationId, getPublicationsByInstitution, test, updateImagePublication, updatePublicaton } from "./publication.controller.js";
import { getMyInstitutions } from '../../src/institution/institution.controller.js'
import { uploadMultiplePublicationImages } from "../../middlewares/multer.uploads.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { addPublicationValidation } from "../../middlewares/validators.js";
import { isOwnerOfPublication } from "../../utils/db.validators.js";

const api = Router()

api.get('my', validateJwt, getMyInstitutions)
api.get('/test', test)
api.get('/list', getAllPublication)
api.get('/:id', getPublicationId)
api.get('/getByInstitution/:institutionId', getPublicationsByInstitution)
api.post('/add', [uploadMultiplePublicationImages, validateJwt, addPublicationValidation],addPublication)
api.put('/update/:id',[validateJwt, isOwnerOfPublication], updatePublicaton)
api.put('/updateImage/:id', [uploadMultiplePublicationImages, validateJwt, isOwnerOfPublication],updateImagePublication)
api.delete('/delete/:id', [validateJwt, isOwnerOfPublication], deletePublication)

export default api