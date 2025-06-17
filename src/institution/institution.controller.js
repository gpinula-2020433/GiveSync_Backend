'use strict'
import fs from 'fs';
import path from 'path';
import Institution from '../institution/institution.model.js'


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


//Agregar Institución
export const addInstitution = async(req, res)=>{
    const data = req.body
    try {
        if(req.files && req.files.length > 0){
            data.imageInstitution = req.files.map(file => file.filename)
        }
        const institution = new Institution(data)
        await institution.save()

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


//Actualizar Institución
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


//Eliminar Institución
export const deleteInstitution = async (req, res) => {
    try {
        let {id} = req.params
        let institution = await Institution.findByIdAndDelete(id)

        if(!institution)
            return res.status(404).send(
        {
            success: false,
            message: 'Institución no encontrada'
        })
        return res.send(
            {
                success: true,
                message: 'Institución eliminada exitosamente'
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