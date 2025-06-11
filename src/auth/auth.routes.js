import { Router } from "express";
import { login, register, test } from "./auth.controller.js";
import {uploadProfilePicture} from '../../middlewares/multer.uploads.js'
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { registerValidator } from "../../middlewares/validators.js";

const api = Router()

api.post(
    '/register',
    [
        uploadProfilePicture.single("imageUser"),
        registerValidator
    ],
    register
)

api.post('/login', login)
api.get('/test', validateJwt,test)

export default api 