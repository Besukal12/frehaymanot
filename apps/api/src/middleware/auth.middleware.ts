import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const isAuthenticated = !!auth.userId;
  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const isAdmin = auth.orgRole === "admin";
  if (!isAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

export function checkUser(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const isUser = auth.orgRole === "user";
  if (!isUser) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
