import { Router } from 'express'
export const customerRouter = Router()
customerRouter.get('/',(_,res)=>{res.json({message:'customerRouter ready'})})
