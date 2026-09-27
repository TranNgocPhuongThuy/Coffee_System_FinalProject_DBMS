import { Router } from 'express'
export const categoryRouter = Router()
categoryRouter.get('/',(_,res)=>{res.json({message:'categoryRouter ready'})})
