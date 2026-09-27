import { Router } from 'express'
export const ingredientRouter = Router()
ingredientRouter.get('/',(_,res)=>{res.json({message:'ingredientRouter ready'})})
