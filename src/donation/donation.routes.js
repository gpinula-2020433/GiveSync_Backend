import { Router } from 'express'
import {
  addDonation,
  getAllDonations,
  getDonationById,
  getDonationsByInstitution
} from './donation.controller.js'
import { donationValidator } from '../../middlewares/validators.js'
import { validateErrors } from '../../middlewares/validate.errors.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()
api.get('/', validateJwt,getAllDonations)
api.get('/:id', validateJwt, getDonationById)
api.post('/add', validateJwt, donationValidator, validateErrors, addDonation)
api.get('/institution/:institutionId', validateJwt, getDonationsByInstitution)


export default api
