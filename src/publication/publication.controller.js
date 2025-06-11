'use strict'

import Publication from './publication.model.js'
import multer from 'multer'

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
                message: 'Publications not found'
            })
        }
        return res.send({
            success:true,
            message: 'Publications found',
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
                    message: 'publication not found'
                }
            )
        return res.send(
            {
                success: true,
                message: 'publication found',
                publication
            }
        )
    } catch (error) {
        console.error('General error', error)
        return res.status(500).send(
            {
                success:false,
                message: 'General error',
                error
            }
        )
    }
}

//save publications
export const addPublication = async (req, res) =>{
    const data = req.body
    try {
        if(req.file?.filename){
            data.imagePublication = req.file.filename //save image route
        }
        let publication = new Publication(data)
        await publication.save()
        return res.status(200).send({message: 'Publications added successfully'})
    } catch (error) {
        console.error(error)
        return res.status(400).send({
            success: false,
            message: error.message || 'Error adding a publication'
        })
    }
}

export const updatePublicaton = async(req, res)=>{
    try {
        const {id} = req.params
        const data = req.body

        const update = await Publication.findByIdAndUpdate(
            id,
            data,
            {new: true}
        )

        if(!update)
            return res.status(404).send(
            {
                success: false,
                message: 'Publication not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Publication updated',
                update
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(400).send({
            success: false,
            message: error.message || 'Error updating publication'
        })
    }
}

export const updateImagePublication = async (req,res) =>{
    try {
        const {id} = req.params
        const {filename} = req.file
        const publication = await Publication.findByIdAndUpdate(
            id,
            {
                imagePublication: filename
            },
            {
                new:true
            }
        )
    
        if(!publication)
            return res.status(404).send(
            {
                success: false,
                message: 'Publication not found - not updated'
            }
        )

        return res.send(
            {
                success: true,
                message: 'Publication updated successfully',
                publication
            }
        )
    } catch (error) {
        console.error('General error', error)
        return res.status(500).send(
            {
                success: false,
                message: 'General Error',
                error
            }
        )
    }
}

export const deletePublication = async (req, res)=>{
    try {
        let {id} = req.params
        let publication = await Publication.findByIdAndDelete(id)

        if (!publication)
            return res.status(404).send(
            {
                success: false,
                message: 'Publication not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Deleted successfully'
            }
        )
    } catch (error) {
        console.error('General error', error)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                error
            }
        )
    }
}