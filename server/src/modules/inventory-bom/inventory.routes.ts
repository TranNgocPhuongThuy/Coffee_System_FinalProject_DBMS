import { Router } from 'express'
import { ingredientRouter } from './ingredient/ingredient.routes'
import { bomRouter } from './bom/bom.routes'
import { importRouter } from './import/import.routes'
import { adjustmentRouter } from './adjustment/adjustment.routes'

export const inventoryRouter = Router()
inventoryRouter.use('/ingredients', ingredientRouter)
inventoryRouter.use('/boms', bomRouter)
inventoryRouter.use('/imports', importRouter)
inventoryRouter.use('/adjustments', adjustmentRouter)