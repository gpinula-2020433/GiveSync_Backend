import { Router } from "express"
import { 
    changeRole, 
    deleteClient, 
    deleteUser, 
    deleteUserProfileImage, 
    deleteUserProfileImageClient, 
    getAllUsers, 
    getAuthenticatedClient, 
    getUserById, 
    updateClient, 
    updatePassword, 
    updateUser,
    updateUserProfileImage,
    updateUserProfileImageClient
} from "./user.controller.js"
import { uploadProfilePicture } from '../../middlewares/multer.uploads.js'
import { validateJwt, isAdmin, isClient } from "../../middlewares/validate.jwt.js"
import { passwordVerify, updateUserValidator } from "../../middlewares/validators.js"

const api = Router()

// Client
api.get('/getAuthenticatedClient', [validateJwt, isClient], getAuthenticatedClient)
api.put('/updateClient/', [validateJwt, isClient, updateUserValidator], updateClient)
api.delete('/deleteClient/', [validateJwt, isClient], deleteClient)
api.put('/updatePassword/', [validateJwt, isClient, passwordVerify], updatePassword)

api.put('/updateUserImageClient/', 
    [
        validateJwt, 
        isClient,
        uploadProfilePicture.single("imageUser")
    ], 
    updateUserProfileImageClient)

api.delete('/deleteUserImageClient/', [validateJwt, isClient], deleteUserProfileImageClient)

// Admin
api.get('/getAllUsersADMIN', [validateJwt, isAdmin], getAllUsers)
api.put('/updateUserADMIN/:id', [validateJwt, isAdmin], updateUser)
api.delete('/deleteUserADMIN/:id', [validateJwt, isAdmin], deleteUser)
api.put('/changeRoleADMIN/:id', [validateJwt, isAdmin], changeRole)
api.get('/getByIdADMIN/:id', [validateJwt, isAdmin], getUserById)
// Imágenes
api.put('/updateUserImage/:id', 
    [
        validateJwt, 
        isAdmin,
        uploadProfilePicture.single("imageUser")
    ], 
    updateUserProfileImage)

api.delete('/deleteUserImage/:id', [validateJwt, isAdmin],deleteUserProfileImage)

export default api
