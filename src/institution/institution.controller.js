'use strict'
import fs from 'fs';
import path from 'path';
import Institution from '../institution/institution.model.js'
import User from '../user/user.model.js'

//Listar todas las instituciones
export const getAllInstitutions = async (req, res) => {
    try {
        const { limit = 10, skip = 0, state } = req.query
        const filter = {}
        if (state) {
            filter.state = state.toUpperCase()
        }
        const institutions = await Institution.find(filter)
            .skip(Number(skip))
            .limit(Number(limit))
        if (institutions.length === 0) {
            return res.status(404).send({
                success: false,
                message: state 
                    ? `No se encontraron instituciones con estado ${state}`
                    : 'No se encontraron instituciones'
            })
        }
        return res.send({
            success: true,
            message: 'Instituciones encontradas',
            institutions
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            err
        })
    }
}


//Listar institución por Id
export const getInstitutionById = async (req, res) => {
    try {
        const { id } = req.params
        const institution = await Institution.findById(id)
        if (!institution) {
            return res.status(404).send({
                success: false,
                message : 'Institución no encontrada'
            })
        }
        return res.send({
            success: true,
            message: 'Institución encontrada',
            institution
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            succes: false,
            message: 'General error',
            err
        })
    }
}


//Listar mis propias instituciones
export const getMyInstitutions = async (req, res) => {
  try {
    const userId = req.user.uid
    const institutions = await Institution.find({ userId })

    if (institutions.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No se encontraron instituciones para este usuario'
      })
    }

    return res.status(200).send({
      success: true,
      message: 'Instituciones del usuario encontradas',
      institutions
    })
  } catch (err) {
    console.error('Error al obtener instituciones del usuario:', err)
    return res.status(500).send({
      success: false,
      message: 'Error general al obtener instituciones',
      err
    })
  }
}


//Agregar Institución
export const addInstitution = async(req, res)=>{
    const data = req.body
    try {
        if(req.files && req.files.length > 0){
            data.imageInstitution = req.files.map(file => file.filename)
        }
        let institution = new Institution(data)
        
        institution.userId = req.user.uid

        await institution.save()
        institution = await Institution.findById(institution._id).populate('userId', 'name surname username, email')

        console.log('Institution created', institution.state)
        return res.send(
            {
                success: true,
                message: 'Guardado exitosamente',
                institution
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

export const updateInstitutionState = async (req, res) => {
  try {
    const { id } = req.params
    const { state } = req.body
    const validStates = ['ACCEPTED', 'REFUSED', 'EARRING']

    if (!validStates.includes(state?.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Usa: ACCEPTED, REFUSED o EARRING'
      })
    }

    // Actualiza la institución
    const institution = await Institution.findByIdAndUpdate(
      id,
      { state: state.toUpperCase() },
      { new: true, runValidators: true }
    )

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institución no encontrada'
      })
    }

    // Si fue aceptada, actualiza el usuario
    if (state.toUpperCase() === 'ACCEPTED') {
      await User.findByIdAndUpdate(
        institution.userId,
        {
          hasInstitution: true,
          institutionId: institution._id
        },
        { new: true }
      )
    }

    return res.json({
      success: true,
      message: 'Estado actualizado correctamente',
      institution
    })

  } catch (err) {
    console.error('Error al actualizar estado', err)
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar estado',
      err
    })
  }
}

//Actualizar Institución
export const updateInstitution = async(req, res)=>{
    try {
        const {id} = req.params
        const data = req.body
        if ('state' in data) {
            delete data.state
        }
        const update = await Institution.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )
        if(!update)
            return res.status(404).send(
                {
                    success: false,
                    message: 'Institución no encontrada'
                }
            )
        return res.send(
            {
                success: true,
                message: 'Institución encontrada y actualizada',
                update
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}


//Actualizar Imagen de la Institución
export const updateInstitutionImage = async(req, res)=>{
    try{
        const {id} = req.params
        const filenames = req.files.map(file => file.filename)
        const institution = await Institution.findByIdAndUpdate(
            id,
            {
                imageInstitution: filenames
            },
            {
                new: true
            }
        )

        if(!institution)
            return res.status(404).send(
                {
                    success: false,
                    message: 'Institución no encontrada - no actualizado'
                }
            )
        
        return res.send(
            {
                success: true,
                message: 'Imagen de institución actualizada exitosamente',
                institution
            }
        )
    }catch(err){
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

export const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params

    // Primero encuentra la institución para obtener el userId antes de eliminarla
    const institution = await Institution.findById(id)

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institución no encontrada'
      })
    }

    // Elimina la institución
    await Institution.findByIdAndDelete(id)

    // Actualiza al usuario relacionado
    await User.findByIdAndUpdate(institution.userId, {
      hasInstitution: false,
      institutionId: null
    })

    return res.json({
      success: true,
      message: 'Institución eliminada exitosamente'
    })
  } catch (err) {
    console.error('General error', err)
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar institución',
      err
    })
  }
}

export const getPendingInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find({ state: 'EARRING' })

    if (institutions.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No pending institutions found'
      })
    }

    return res.send({
      success: true,
      message: 'Pending institutions retrieved successfully',
      institutions
    })
  } catch (err) {
    console.error('Error getting pending institutions:', err)
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
      err
    })
  }
}