import { Router } from 'express'
export const loyaltyRouter = Router()
loyaltyRouter.get('/',(_,res)=>{res.json({message:'loyaltyRouter ready'})})
