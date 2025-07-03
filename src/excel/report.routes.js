import { Router } from "express";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { exportExcel } from "./exportExcel.js";

const api = Router()

api.get('/export-excel', validateJwt, exportExcel)

export default api