import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ZodError } from 'zod';
import { Response } from 'express';

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter<ZodError> {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 400;

    const formattedErrors = exception.issues.map(
      (issue) => `Field: ${issue.path.join('.')} - Message: ${issue.message}`,
    );

    return response.status(status).json({
      message: 'Validation Failed',
      status: 'fail',
      code: status,
      errors: formattedErrors,
    });
  }
}
