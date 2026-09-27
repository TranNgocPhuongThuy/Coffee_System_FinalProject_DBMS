import { Router } from 'express'
export const importRouter = Router()
importRouter.get('/',(_,res)=>{res.json({message:'importRouter ready'})})
