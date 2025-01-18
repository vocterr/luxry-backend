import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    jwt.verify(token, process.env.JWT_TOKEN as string, (err: any, decoded: any) => {
      if (err) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
      }

      req.user = { userId: decoded.userId };
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return; 
  }
};


export const authorize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(403).json({ error: "Unauthorized: No user data found" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: String(req.user.userId)
      }
    })
  
    if (user!.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden: Access is denied" });
      return;
    }
  
    next();
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
}
