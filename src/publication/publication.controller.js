'use strict'

import Publication from './publication.model.js'
import Comment from '../comment/comment.model.js'

export const test = async (req, res)=>{
    return res.send('The publication conection is running')
}

//list all publications
export const getAllPublication = async (req,res)=>{
    const {limit, skip} = req.query
    try{
        const publication = await Publication.find()
        .skip(skip)
        .limit(limit)

        if(publication.length == 0){
            return res.status(404).send({
                success: false,
                message: 'No se encontro la publicación'
            })
        }
        return res.send({
            success:true,
            message: 'Publicaciones encontradas:',
            publication
        })
    }catch(error){
        console.error('General error', error)
        return res.status(500).send({
            success: false,
            message: 'General error',
            error
        })
    }
}

export const getPublicationId = async(req,res)=>{
    try {
        let {id} = req.params
        const publication = await Publication.findById(id)

        if(!publication)
            return res.status(404).send(
                {
                    success: false,
                    message: 'No se encontro la publicación'
                }
            )
        return res.send(
            {
                success: true,
                message: 'Publicación encontrada:',
                publication
            }
        )
    } catch (error) {
        console.error('Error general', error)
        return res.status(500).send(
            {
                success:false,
                message: 'Error general',
                error
            }
        )
    }
}

//obtener publicaciones por institución
export const getPublicationsByInstitution = async(req, res)=>{
    try {
        const {institutionId} = req.params

        const publications = await Publication.find({institutionId})

        if(publications.length == 0){
            return res.status(404).send({
                success: false,
                message: 'No se encontraron publicaciones para está intitución'
            })
        }

        return res.send({
            success: true,
            message: `Publicaciones de la institución ${institutionId}: `,
            publications
        })
    } catch (error) {
        console.error('Error al obtener publicaciones por intitución', error)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            error
        })
    }
}


//Guatdar publicaciones
export const addPublication = async (req, res) =>{
    const data = req.body
    try {
        if(req.files && req.files.length > 0){
            data.imagePublication = req.files.map(file => file.filename)
        }

        let publication = new Publication(data)
        await publication.save()
        
        return res.status(200).send({message: 'Publicación agregada correctamente'})

    } catch (error) {
        console.error(error)
        return res.status(400).send({
            success: false,
            message: error.message || 'Error agregando la publicación'
        })
    }
}

export const updatePublicaton = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body

        const update = await Publication.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )

        if(!update)
            return res.status(404).send(
            {
                success: false,
                message: 'No se encontro la publicación'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Publicación actualizada correctamente',
                update
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(400).send({
            success: false,
            message: error.message || 'Error al actualizar la publicación'
        })
    }
}

export const updateImagePublication = async (req,res) =>{
    try {
        const {id} = req.params
        const filenames = req.files.map(file => file.filename)
        const publication = await Publication.findByIdAndUpdate(
            id,
            {imagePublication: filenames},
            {new: true}
        )
    
        if(!publication)
            return res.status(404).send(
            {
                success: false,
                message: 'No se encontro la publicación'
            }
        )

        return res.send(
            {
                success: true,
                message: 'Publicación actualizada correctamente',
                publication
            }
        )
    } catch (error) {
        console.error('Error general', error)
        return res.status(500).send(
            {
                success: false,
                message: 'Error actualizando imágenes',
                error
            }
        )
    }
}

export const deletePublication = async (req, res)=>{
    try {
        let {id} = req.params

        //Elimina todos los comentarios relacionados a la publicación eliminada
        await Comment.deleteMany({publicationId: id})

        let publication = await Publication.findByIdAndDelete(id)

        if (!publication)
            return res.status(404).send(
            {
                success: false,
                message: 'No se encontro la publicación'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Eliminado correctamente'
            }
        )
    } catch (error) {
        console.error('Error general', error)
        return res.status(500).send(
            {
                success: false,
                message: 'Error general',
                error
            }
        )
    }
}