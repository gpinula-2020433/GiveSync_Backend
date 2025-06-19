import { Router } from 'express'
import {
  addDonation,
  getAllDonations,
  getDonationById,
  getDonationsToMyInstitution,
} from './donation.controller.js'
import { donationValidator } from '../../middlewares/validators.js'
import { validateErrors } from '../../middlewares/validate.errors.js'
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.get('/', validateJwt, getAllDonations)
api.get('/:id', validateJwt, getDonationById)
api.post('/add', validateJwt, donationValidator, validateErrors, addDonation)
api.get('/institution/my', validateJwt, getDonationsToMyInstitution);

export default api

