import User from '../user/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const test = (req, res)=>{
    console.log('Test is running')
    res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        user.role = 'CLIENT'
        user.imageUser = req.file?.filename || null
        await user.save()

        // 🔴 EMITIR evento socket
        const io = req.app.get('io');
        io.emit('newUser', user);

        return res.send(
            {
                message: `Registro Satisfactorio ya puedes iniciar sesión: ${user.name}`,
                registeredUser: user
            }
        )
    } catch (error) {
        return res.status(500).send({message: 'General error with user registration', error})
    }
}

export const login = async(req,res)=>{
    try {
        
        let {userLoggin ,password} = req.body
        
        let user = await User.findOne(
            {
                $or: [
                    {email: userLoggin} ,
                    {username: userLoggin}

                ]
            }
        )
        if(user && await checkPassword(user.password, password)){
            let loggedUser = {
                uid: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                username: user.username,
                imageUser: user.imageUser,
                hasInstitution: user.hasInstitution,
                institutionId: user.institutionId,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Bienvenido ${user.name}`,
                    loggedUser,
                    token
                }
            )
        } 
        return res.status(400).send({message:'Credenciales inválidas'})
    } catch (err) {
        return res.status(500).send({message:'General error with login function', err})
    }
}