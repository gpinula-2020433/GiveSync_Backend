import Donation from './donation.model.js'
import Institution from '../institution/institution.model.js'
import User from '../user/user.model.js'
import { findUser } from '../../utils/db.validators.js'

export const addDonation = async (req, res) => {
  const { amount, institution } = req.body
  const user = req.user.uid

  try {
    if (!user) throw new Error('Usuario no autenticado')

    const userExists = await findUser(user)
    if (!userExists) throw new Error('Usuario no encontrado')

    const institutionExists = await Institution.findById(institution)
    if (!institutionExists) throw new Error('Institución no encontrada')

    const maintenanceAmount = amount * 0.1
    const institutionAmount = amount * 0.9

    const newDonation = new Donation({
      amount,
      maintenanceAmount,
      institutionAmount,
      institution,
      user,
      institutionData: {
        name: institutionExists.name,
        type: institutionExists.type,
        description: institutionExists.description
      },
      userData: {
        name: userExists.name,
        surname: userExists.surname,
        username: userExists.username
      }
    })

    const savedDonation = await newDonation.save()

    res.status(201).json({
      success: true,
      message: 'Donación registrada exitosamente',
      donation: savedDonation
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || 'Error al registrar la donación'
    })
  }
}

export const getAllDonations = async (req, res) => {
  const { limit = 10, skip = 0 } = req.query

  try {
    const donations = await Donation.find()
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('institution', 'name type')
      .populate('user', 'name surname username')

    if (donations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron donaciones'
      })
    }
    
    const cleanedDonations = donations.map(donation => {
      const d = donation.toObject()
      if (d.user === null) delete d.user
      return d
    })

    return res.json({
      success: true,
      message: 'Donaciones encontradas',
      total: cleanedDonations.length,
      donations: cleanedDonations
    })
  } catch (err) {
    console.error('Error al obtener donaciones:', err)
    return res.status(500).json({
      success: false,
      message: 'Error al obtener donaciones',
      error: err.message
    })
  }
}

export const getDonationById = async (req, res) => {
  const { id } = req.params

  try {
    const donation = await Donation.findById(id)
      .populate('institution', 'name type')
      .populate('user', 'name surname username')

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donación no encontrada'
      })
    }

    const donationObj = donation.toObject()
    if (donationObj.user === null) delete donationObj.user

    return res.json({
      success: true,
      message: 'Donación encontrada',
      donation: donationObj
    })
  } catch (err) {
    console.error('Error al obtener donación:', err)
    return res.status(500).json({
      success: false,
      message: 'Error al obtener donación',
      error: err.message
    })
  }
}