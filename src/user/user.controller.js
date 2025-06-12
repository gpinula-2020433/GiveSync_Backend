'use strict'

import User from '../user/user.model.js'
import { unlink } from 'fs/promises'
import path from 'path'
import { encrypt, checkPassword, checkUpdate } from '../../utils/encrypt.js'

export const test = async (req, res) => {
    return res.send('The user route is running')
}

export const defaultAdmin = async (nameA, surnameA, usernameA, emailA, passwordA, roleA) => {
    try {
        let adminFound = await User.findOne({ role: 'ADMIN' })
        let usernameExists = await User.findOne({ username: usernameA })
        let emailExists = await User.findOne({ email: emailA })

        if (adminFound) {
            return console.log('Default admin already exists.')
        }

        if (usernameExists || emailExists) {
            return console.log('Cannot create default admin: username or email already exists.')
        }

        const data = {
            name: nameA,
            surname: surnameA,
            username: usernameA,
            email: emailA,
            password: await encrypt(passwordA),
            role: roleA
        }

        let user = new User(data)
        await user.save()
        console.log('A default admin has been created.')
    } catch (err) {
        console.error('Error creating default admin:', err)
    }
}

defaultAdmin('Gabriel ', 'Pinula', '1pinula', 'pinula@gmail.com', '123123Aa!', 'ADMIN')

export const changeRole = async(req, res)=>{
    try {
        let {id} = req.params

        let data = req.body
        let update = checkUpdate(data.role, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing' })

        let updatedUser = await User.findByIdAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updatedUser) return res.status(404).send({ message: 'User not found' })
        
        return res.status(200).send({message: 'The role has been changed successfully.'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error changing role'})
    }

}


//GET USER BY ID
export const getUserById = async(req, res)=>{
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }
        return res.send({
            success: true,
            message: 'User found',
            user
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating the user'})
    }
}

export const getAllUsers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    if (limit < 0 || skip < 0) {
        return res.status(400).send({
            success: false,
            message: 'Limit and skip must be non-negative integers'
        })
    }

    try {
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if (users.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No users found'
            })
        }

        return res.send({
            success: true,
            message: 'Users retrieved successfully',
            total: users.length,
            data: users
        });
    } catch (err) {
        console.error('Error retrieving users:', err);
        return res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: err.message
        })
    }
}

//UPDATE ADMIN
export const updateUser = async (req, res) => {
    try {
        //Getting the id by the token
        let { _id } = req.user
        
        let { id } = req.params
        
        let data = req.body

        //Validating that the user can only update his own profile or another clients
        let user = await User.findOne({_id: id})

        if((user.role == 'ADMIN') && (_id != id)){ 
            return res.status(403).send({
                message: 'You cannot update another admin, you can only update yourself or clients.'
            })
        }
        
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Data cannot be updated or  data missing' })

        let updatedUser = await User.updateOne(
            { _id: id },
            data,
            { new: true }
        )

        if (!updatedUser) return res.status(404).send({ message: 'User not found' })

        return res.status(200).send({message: 'User updated successfully.'})
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating the user'})
    }
}

//Admin
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const { _id } = req.user

    const user = await User.findOne({ _id: id })
    if (!user) return res.status(404).send({ message: 'User not found' })

    if (user.username === 'djulian')
      return res.status(403).send({ message: 'You cannot delete the default admin' })

    if (user.role === 'ADMIN' && _id != id)
      return res.status(403).send({ message: 'You cannot delete another admin. You can only delete yourself or clients.' })

    //Eliminar imagen si existe
    if (user.imageUser) {
      const imagePath = path.join(process.cwd(), 'uploads/img/users', user.imageUser)
      try {
        await unlink(imagePath)
      } catch (err) {
        console.warn(`Failed to delete user image: ${err.message}`)
      }
    }
    
    const usernameOfDeletedUser = user.username
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) return res.status(404).send({ message: 'User not found' })

    return res.send({
      message: `Account with username ${usernameOfDeletedUser} deleted successfully`
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error deleting account' })
  }
}

//CLIENT
export const updateClient = async (req, res) => {
  try {
      const { uid } = req.user  // Obtener el uid del usuario autenticado
      const data = req.body

      console.log('Authenticated user ID:', uid)

      // Verificar si el usuario con el uid existe
      const user = await User.findById(uid)
      if (!user) {
          return res.status(404).send({
              message: 'User not found.'
          })
      }

      // Validar que los datos que se intentan actualizar son correctos
      const update = checkUpdate(data, uid)
      if (!update) {
          return res.status(400).send({
              message: 'Invalid or missing data for update.'
          })
      }

      // Realizar la actualización
      const updatedUser = await User.findByIdAndUpdate(
          uid,
          data,
          { new: true }  // Devuelve el documento actualizado
      )

      return res.status(200).send({
          message: 'User updated successfully.',
          user: updatedUser.toJSON()  // Retorna el usuario actualizado sin password
      })

  } catch (err) {
      console.error(err)
      return res.status(500).send({
          message: 'Error updating the user.'
      })
  }
}

export const updatePassword = async(req, res)=>{
    try {
        let {uid} = req.user
        const { currentPassword, newPassword} = req.body

        if(!currentPassword || ! newPassword)
            return res.status(400).send({message: 'Missing curretn or new password'})

        const user = await User.findById(uid)
        if(!user) return res.status(400).send({message: 'User not found'})

        const validPassword = await checkPassword(user.password, currentPassword)
        if(!validPassword) return res.status(400).send({message: 'Incorrect password'})

        if(newPassword.length < 8 || newPassword.length > 100){
            return res.status(400).send({message: 'Password must be have min 8 characters and max 100 characters'})
        }

        user.password = await encrypt(newPassword)
        await user.save()

        return res.status(200).send({message: 'Password update successfully!'})
    } catch (error) {
        console.error(err)
        return res.status(500).send({message: 'Error updating the password'})
    }
}

export const deleteClient = async (req, res) => {
  try {
    const { uid } = req.user
    const { password } = req.body

    const user = await User.findById(uid)

    if (!user) {
      return res.status(404).send({ message: 'User not found' })
    }

    if (user.role === 'ADMIN') {
      return res.status(401).send({ message: 'You cannot delete an admin.' })
    }

    const check = await checkPassword(user.password, password)
    if (!check) {
      return res.status(401).send({ message: 'Invalid password' })
    }

    // Eliminar imagen si existe
    if (user.imageUser) {
      const imagePath = path.join(process.cwd(), 'uploads/img/users', user.imageUser)
      try {
        await unlink(imagePath)
      } catch (err) {
        console.warn(`Failed to delete user image: ${err.message}`)
      }
    }

    const deletedUser = await User.findByIdAndDelete(uid)

    return res.send({
      message: `Account with username ${deletedUser.name} deleted successfully`
    })
  } catch (err) {
    console.error(err)
    return res.status(500).send({ message: 'Error deleting account' })
  }
}


export const updateUserImage = async (req, res) => {
  try {
    const { id } = req.params

    //Validar que haya una imagen enviada
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: 'No image file provided'
      })
    }
    
    const { filename } = req.file

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).send(
            {
                success: false,
                message: 'User not found - not updated'
            }
        )
    }

    if (user.imageUser) {
      const imagePath = path.join(process.cwd(), 'uploads/img/users', user.imageUser)
      try {
        await unlink(imagePath)
      } catch (err) {
        console.warn('Error deleting old user image:', err.message)
      }
    }

    //Actualizar con nueva imagen
    user.imageUser = filename
    await user.save()

    return res.send({
      success: true,
      message: 'User image updated successfully',
      user
    })
  } catch (err) {
    console.error('General error', err)
    return res.status(500).send({
      success: false,
      message: 'General error',
      err
    })
  }
}

export const deleteUserProfileImage = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      })
    }

    if (!user.imageUser) {
      return res.status(400).send({
        success: false,
        message: 'User does not have a profile image'
      })
    }

    const imagePath = path.join(process.cwd(), 'uploads/img/users', user.imageUser)

    try {
      await unlink(imagePath)
    } catch (err) {
      console.warn('Error deleting image file:', err.message)
      return res.status(500).send({
        success: false,
        message: 'Error deleting image file',
        error: err.message
      })
    }

    user.imageUser = null
    await user.save()

    return res.send({
      success: true,
      message: 'Profile image deleted successfully',
      user
    })

  } catch (err) {
    console.error('General error:', err)
    return res.status(500).send({
      success: false,
      message: 'General error',
      error: err.message
    })
  }
}
