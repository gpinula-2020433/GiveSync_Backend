import { Router} from "express";
import { addPublication, deletePublication, getAllPublication, getPublicationId, test, updateImagePublication, updatePublicaton } from "./publication.controller.js";
import { uploadProfilePicture } from "../../middlewares/multer.uploads.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { addPublicationValidation } from "../../middlewares/validators.js";
import { isOwnerOfPublication } from "../../utils/db.validators.js";

const api = Router()

api.get('/test', test)
api.get('/list', getAllPublication)
api.get('/:id', getPublicationId)
api.post('/add', [uploadProfilePicture.single('imagePublication'), validateJwt, addPublicationValidation],addPublication)
api.put('/update/:id',[validateJwt, isOwnerOfPublication], updatePublicaton)
api.put('/updateImage/:id', [uploadProfilePicture.single('imagePublication'), validateJwt, isOwnerOfPublication],updateImagePublication)
api.delete('/delete/:id', [validateJwt, isOwnerOfPublication], deletePublication)

export default api