import Institution from '../institution/institution.model.js'
import { generateExcel } from '../../utils/generateExcel.js'

export const exportExcel = async (req, res) =>{
    try {
        const institutions = await Institution.find().populate('userId', 'email username')
        await generateExcel(res, institutions)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error al generar excel'})
    }
}