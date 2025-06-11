import { Router } from 'express'
import {
  addDonation,
  getAllDonations,
  getDonationById
} from './donation.controller.js'

const api = Router()

api.get('/', getAllDonations)
api.get('/:id', getDonationById)
api.post('/add', addDonation)

export default api
