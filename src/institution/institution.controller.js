'use strict'
import fs from 'fs';
import path from 'path';
import Institution from '../institution/institution.model.js'


//Listar todas las instituciones
export const getAllInstitutions= async (req, res)=> {
    try{
        const {limit = 10, skip =0}= req.query
        const institution = await Institution.find()
            .skip(skip)
            .limit(limit)
        if(institution.length === 0)
            return res.status(404).send(
            {
                succes: false,
                message: 'Instituciones no encontradas'

            }
        )
        return res.send(
            {
                succes: true,
                message: 'Instituciones encontradas',
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
        if(req.file?.filename){
            data.imageInstitution = req.file.filename
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
                message: 'Eliminado exitosamente'
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