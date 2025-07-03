import ExcelJS from 'exceljs'

export const generateExcel = async (res, institutions) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Institutions')

  sheet.columns = [
    { header: 'Nombre', key: 'name', width: 30 },
    { header: 'Tipo', key: 'type', width: 15 },
    { header: 'Descripción', key: 'description', width: 40 },
    { header: 'Dirección', key: 'address', width: 30 },
    { header: 'Teléfono', key: 'phone', width: 15 },
    { header: 'Estado', key: 'state', width: 15 },
    { header: 'Usuario', key: 'user', width: 30 }
  ]

  institutions.forEach(inst => {
    sheet.addRow({
      name: inst.name,
      type: inst.type,
      description: inst.description,
      address: inst.address,
      phone: inst.phone,
      state: inst.state,
      user: inst.userId?.email || inst.userId?.username || 'N/A'
    })
  })

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader('Content-Disposition', 'attachment; filename=institutions.xlsx')

  await workbook.xlsx.write(res)
  res.end()
}
