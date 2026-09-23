declare module 'sql.js' {
  const initSqlJs: any;
  export default initSqlJs;
  export type Database = any;
}

declare module '../auth/middleware.js' {
  export interface JwtPayload {
    sub: string;
    iat?: number;
    exp?: number;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: import('../auth/middleware.js').JwtPayload;
    }
  }
}

export {};
