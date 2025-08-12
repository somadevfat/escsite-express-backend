import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodObject, ZodIssue } from 'zod';

export const validate =
  (schema: ZodObject<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        return next();
      } catch (error: any) {
        if (error instanceof ZodError) {
          const validationErrors = error.issues.map((issue: ZodIssue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }));
          return res.status(422).json({
            error: 'Validation Error',
            message: 'Validation failed',
            statusCode: 422,
            validationErrors,
          });
        }
        return next(error);
      }
    };
