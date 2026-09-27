import { Router } from 'express'
export const reportRouter = Router()
reportRouter.get('/',(_,res)=>{res.json({message:'reportRouter ready'})})
