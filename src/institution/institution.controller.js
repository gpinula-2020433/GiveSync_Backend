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