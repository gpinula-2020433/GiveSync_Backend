import { Router } from "express"
import { 
    changeRole, 
    deleteClient, 
    deleteUser, 
    deleteUserProfileImage, 
    getAllUsers, 
    getUserById, 
    test, 
    updateClient, 
    updatePassword, 
    updateUser, 
    updateUserImage 
} from "./user.controller.js"
import { uploadProfilePicture } from '../../middlewares/multer.uploads.js'
import { validateJwt, isAdmin, isClient } from "../../middlewares/validate.jwt.js"
import { passwordVerify } from "../../middlewares/validators.js"

const api = Router()

api.get('/test', test)

// Admin
api.get('/getAllUsersADMIN', [validateJwt, isAdmin], getAllUsers)
api.put('/updateUserADMIN/:id', [validateJwt, isAdmin], updateUser)
api.delete('/deleteUserADMIN/:id', [validateJwt, isAdmin], deleteUser)
api.put('/changeRoleADMIN/:id', [validateJwt, isAdmin], changeRole)
api.get('/getByIdADMIN/:id', [validateJwt, isAdmin], getUserById)

// Client
api.put('/updateClient/', [validateJwt, isClient], updateClient)
api.delete('/deleteClient/', [validateJwt, isClient], deleteClient)
api.put('/updatePassword/:id', [validateJwt, isClient, passwordVerify], updatePassword)

// Imágenes
api.put('/updateUserImage/:id', 
    [
        validateJwt, 
        uploadProfilePicture.single("imageUser")
    ], 
    updateUserImage)

api.delete('/deleteUserImage/:id', deleteUserProfileImage)

export default api
