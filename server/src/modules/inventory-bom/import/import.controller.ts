import { Request, Response, NextFunction } from 'express'
import { ImportService } from './import.service'
import {
  CreateImportTicketSchema,
  ImportTicketParamsSchema,
  QueryImportTicketSchema,
} from './import.schema'

export class ImportController {
  private importService = new ImportService()

  getImportTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = QueryImportTicketSchema.parse(req.query)
      const data = await this.importService.getImportTickets(query)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  getImportDetailById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { importId } = ImportTicketParamsSchema.parse(req.params)
      const data = await this.importService.getImportDetailById(importId)
      res.status(200).json({ success: true, data })
    } catch (error) {
      next(error)
    }
  }

  createImportTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = CreateImportTicketSchema.parse(req.body)
      const result = await this.importService.createImportTicket(body)
      res.status(201).json({
        success: true,
        ...result,
      })
    } catch (error) {
      next(error)
    }
  }
}