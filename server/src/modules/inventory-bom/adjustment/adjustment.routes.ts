import { Router } from 'express'
export const adjustmentRouter = Router()
adjustmentRouter.get('/',(_,res)=>{res.json({message:'adjustmentRouter ready'})})
