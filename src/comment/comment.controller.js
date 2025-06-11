'use strict'
import path from 'path'
import Comment from './comment.model.js'
import fs from 'fs'

export const getAllComments = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query
    const comments = await Comment.find()
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    if (comments.length === 0)
      return res.status(404).send({
        success: false,
        message: 'Comments not found'
      })

    return res.send({
      success: true,
      message: 'Comments found',
      comments
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

export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params
    const comment = await Comment.findById(id)
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    if (!comment) {
      return res.status(404).send({
        success: false,
        message: 'Comment not found'
      })
    }

    return res.send({
      success: true,
      message: 'Comment found',
      comment
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

export const addComment = async (req, res) => {
  try {
    const data = req.body
    if (req.file?.filename) {
      data.commentImage = req.file.filename
    }

    let comment = new Comment(data)
    await comment.save()

    comment = await Comment.findById(comment._id)
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    return res.send({
      success: true,
      message: `Comment added successfully`,
      comment
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

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params
    let data = req.body

    if (req.file?.filename) {
      data.commentImage = req.file.filename
    }

    const comment = await Comment.findByIdAndUpdate(id, data, { new: true })
      .populate('userId', 'name email')
      .populate('publicationId', 'title')

    if (!comment)
      return res.status(404).send({
        success: false,
        message: 'Comment not found'
      })

    return res.send({
      success: true,
      message: 'Comment updated',
      comment
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

// DELETE - Eliminar comentario
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params
    const comment = await Comment.findByIdAndDelete(id)

    if (!comment)
      return res.status(404).send({
        success: false,
        message: 'Comment not found'
      })

    return res.send({
      success: true,
      message: 'Comment deleted successfully'
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
