import Donation from './donation.model.js'
import { existUser, existInstitution } from '../../utils/db.validators.js'

export const addDonation = async (req, res) => {
  const { amount, date, institution, user } = req.body

  try {
    await existUser(user);
    await existInstitution(institution)

    const newDonation = new Donation({
      amount,
      date,
      institution,
      user
    })

    const savedDonation = await newDonation.save();

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
      .populate('institution')
      .populate('user')

    if (donations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron donaciones'
      })
    }

    return res.json({
      success: true,
      message: 'Donaciones encontradas',
      total: donations.length,
      donations
    })
  } catch (err) {
    console.error('Error al obtener donaciones:', err);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener donaciones',
      error: err.message
    })
  }
}

export const getDonationById = async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findById(id)
      .populate('institution')
      .populate('user')

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donación no encontrada'
      })
    }

    return res.json({
      success: true,
      message: 'Donación encontrada',
      donation
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
