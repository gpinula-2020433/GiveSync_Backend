import { Router } from 'express'
import {
  addDonation,
  getAllDonations,
  getDonationById
} from './donation.controller.js'
import { donationValidator } from '../../middlewares/validators.js'
import { validateErrors } from '../../middlewares/validate.errors.js'

const api = Router()
api.get('/', getAllDonations)
api.get('/:id', getDonationById)
api.post('/add', donationValidator, validateErrors, addDonation)

export default api
