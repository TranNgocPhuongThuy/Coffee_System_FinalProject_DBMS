import { Router } from 'express'
export const orderRouter = Router()
orderRouter.get('/',(_,res)=>{res.json({message:'orderRouter ready'})})
