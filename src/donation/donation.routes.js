import { Router } from 'express'
import {
  addDonation,
  getAllDonations,
  getDonationById
} from './donation.controller.js'
import { donationValidator } from '../../middlewares/validators.js'
import { validateErrors } from '../../middlewares/validate.errors.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()
api.get('/', validateJwt, isAdmin,getAllDonations)
api.get('/:id', validateJwt, getDonationById)
api.post('/add', validateJwt, donationValidator, validateErrors, addDonation)

export default api
