import { Router } from 'express'
export const kdsRouter = Router()
kdsRouter.get('/',(_,res)=>{res.json({message:'kdsRouter ready'})})
