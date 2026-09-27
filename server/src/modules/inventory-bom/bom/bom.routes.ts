import { Router } from 'express'
export const bomRouter = Router()
bomRouter.get('/',(_,res)=>{res.json({message:'bomRouter ready'})})
