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
      return; // Stop execution to ensure middleware returns `void`
    }

    jwt.verify(token, "1234", (err: any, decoded: any) => {
      if (err) {
        res.status(401).json({ error: "Invalid or expired token" });
        return; // Stop execution
      }

      req.user = { userId: decoded.userId }; // Attach user to the request
      next(); // Pass control to the next middleware/route
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return; // Ensure the function stops here
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
