import { Router } from 'express'
export const toppingRouter = Router()
toppingRouter.get('/',(_,res)=>{res.json({message:'toppingRouter ready'})})
