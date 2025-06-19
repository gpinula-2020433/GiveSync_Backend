'use strict'
import fs from 'fs';
import path from 'path';
import Institution from '../institution/institution.model.js'


export const test = async (req, res) => {
    return res.send('The institution route is running')
}

export const getAllInstitutions= async (req, res)=> {
    try{
        const {limit = 10, skip =0}= req.query
        const institution = await Institution.find()
            .skip(skip)
            .limit(limit)
            .populate('services', "name type description state")
        if(institution.length === 0)
            return res.status(404).send(
            {
                succes: false,
                message: 'Institutions not found'

            }
        )
        return res.send(
            {
                succes: true,
                message: 'Institutions found',
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

export const getInstitutionById = async (req, res) => {
    try {
        const { id } = req.params
        const institution = await Institution.findById(id)
        if (!institution) {
            return res.status(404).send({
                success: false,
                message : 'Institution not found'
            })
        }
        return res.send({
            success: true,
            message: 'Institution found',
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

export const addInstitution = async(req, res)=>{
    const data = req.body
    try {
        if(req.file?.filename){
            data.imageInstitution = req.file.filename
        }
        const institution = new Institution(data)
        await institution.save()

        return res.send(
            {
                success: true,
                message: 'Saved successfully',
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

export const updateInstitution = async(req, res)=>{
    try {
        const {id} = req.params
        const data = req.body

        const update = await Institution.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )

        if(!update)
            return res.status(404).send(
                {
                    success: false,
                    message: 'Institution not found'
                }
            )
        return res.send(
            {
                success: true,
                message: 'Institution updated',
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


export const updateInstitutionImage = async(req, res)=>{
    try{
        const {id} = req.params
        const {filename} = req.file
        const institution = await Institution.findByIdAndUpdate(
            id,
            {
                imageInstitution: filename
            },
            {
                new: true
            }
        )

        if(!institution)
            return res.status(404).send(
                {
                    success: false,
                    message: 'Institution not found - not updated'
                }
            )
        
        return res.send(
            {
                success: true,
                message: 'Institution updated successfully',
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
        let {id} = req.params
        let institution = await Institution.findByIdAndDelete(id)

        if(!institution)
            return res.status(404).send(
        {
            success: false,
            message: 'Institution not founded'
        })
        return res.send(
            {
                success: true,
                message: 'Deleted succesfully'
            }
        )
    } catch (err) {
        console.error('General error',err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
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

export const updateInstitutionState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const validStates = ['REFUSED', 'ACCEPTED'];
    if (!validStates.includes(state)) {
      return res.status(400).send({
        success: false,
        message: 'Invalid state value'
      })
    }

    const updated = await Institution.findByIdAndUpdate(id, { state }, { new: true })

    if (!updated) {
      return res.status(404).send({
        success: false,
        message: 'Institution not found'
      })
    }

    return res.send({
      success: true,
      message: `Institution ${state === 'ACCEPTED' ? 'accepted' : 'refused'} successfully`,
      institution: updated
    });
  } catch (err) {
    console.error('Error updating institution state:', err);
    return res.status(500).send({
      success: false,
      message: 'Internal server error',
      err
    })
  }
}