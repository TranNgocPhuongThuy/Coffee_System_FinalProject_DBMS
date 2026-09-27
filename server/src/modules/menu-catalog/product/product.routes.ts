import { Router } from 'express'
export const productRouter = Router()
productRouter.get('/',(_,res)=>{res.json({message:'productRouter ready'})})
