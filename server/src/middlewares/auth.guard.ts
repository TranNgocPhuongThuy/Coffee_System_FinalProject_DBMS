import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "@/config/env.config";
import { getPool, sql } from "@/config/database";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        fullName: string;
        role:
          | "ADMIN"
          | "MANAGER"
          | "CASHIER"
          | "BARISTA"
          | "STOREKEEPER"
          | "CUSTOMER";
        userType: "EMPLOYEE" | "CUSTOMER";
        username?: string;
        phoneNumber?: string;
      };
    }
  }
}

interface JwtPayload {
  id: number;
  role:
    | "ADMIN"
    | "MANAGER"
    | "CASHIER"
    | "BARISTA"
    | "STOREKEEPER"
    | "CUSTOMER";
  userType: "EMPLOYEE" | "CUSTOMER";
}

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Yêu cầu đăng nhập để truy cập tài nguyên này (Thiếu Bearer Token).",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, envConfig.JWT_SECRET) as JwtPayload;
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Phiên đăng nhập đã hết hạn."
            : "Token xác thực không hợp lệ.",
      });
      return;
    }

    const pool = await getPool();

    // 1. Nhánh Khách hàng: Chỉ query bảng Customer
    if (decoded.userType === "CUSTOMER") {
      const custRes = await pool
        .request()
        .input("id", sql.Int, decoded.id)
        .query(`
          SELECT id, phoneNumber, fullName, membershipTier 
          FROM Customer 
          WHERE id = @id AND deletedAt IS NULL
        `);

      if (custRes.recordset.length === 0) {
        res.status(401).json({
          success: false,
          message: "Tài khoản khách hàng không tồn tại hoặc đã bị khóa.",
        });
        return;
      }

      const cust = custRes.recordset[0];
      req.user = {
        id: cust.id,
        fullName: cust.fullName,
        phoneNumber: cust.phoneNumber,
        role: "CUSTOMER",
        userType: "CUSTOMER",
      };
      return next();
    }

    // 2. Nhánh Nhân viên nội bộ: Chỉ query bảng Employee
    if (decoded.userType === "EMPLOYEE") {
      const empRes = await pool
        .request()
        .input("id", sql.Int, decoded.id)
        .query(`
          SELECT id, username, fullName, role, status, phoneNumber 
          FROM Employee 
          WHERE id = @id AND deletedAt IS NULL
        `);

      if (empRes.recordset.length === 0) {
        res.status(401).json({
          success: false,
          message: "Tài khoản nhân viên không tồn tại hoặc đã bị xóa.",
        });
        return;
      }

      const emp = empRes.recordset[0];
      if (emp.status !== "ACTIVE") {
        res.status(403).json({
          success: false,
          message: "Tài khoản nhân viên đã bị khóa hoặc ngừng hoạt động.",
        });
        return;
      }

      req.user = {
        id: emp.id,
        fullName: emp.fullName,
        username: emp.username,
        phoneNumber: emp.phoneNumber,
        role: emp.role,
        userType: "EMPLOYEE",
      };
      return next();
    }

    res.status(401).json({
      success: false,
      message: "Đối tượng người dùng không hợp lệ trong hệ thống.",
    });
  } catch (error) {
    next(error);
  }
};