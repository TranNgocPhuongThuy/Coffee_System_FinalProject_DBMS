import { Router } from 'express'
export const pagerRouter = Router()
pagerRouter.get('/',(_,res)=>{res.json({message:'pagerRouter ready'})})
