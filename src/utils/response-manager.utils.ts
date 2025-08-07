import { ValidationError } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

export type paginatedResponse = {
  code: number;
  data: Array<Record<any, any>>;
  message: string;
  status: string;
  meta: meta;
  extradata?: object;
};

export type standardResponse = {
  code: number;
  data: Record<any, any> | null;
  message: string;
  status: string;
};

export type meta = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export class ResponseManager {
  public static standardResponse(
    status: string,
    code: number,
    message: string,
    results: Record<any, any> | null,
  ): standardResponse {
    return {
      status,
      code,
      message,
      data: results,
    };
  }

  public static paginatedResponse(
    status: string,
    code: number,
    message: string,
    results: Array<Record<any, any>>,
    meta: meta,
    extradata?: object,
  ): paginatedResponse {
    return {
      status,
      code,
      message,
      data: results,
      meta,
      extradata,
    };
  }

  public static standardResponseForClassValidatorExceptions(
    validationErrors: ValidationError[] = [],
  ): HttpException {
    if (validationErrors.length === 0) {
      return new HttpException(
        ResponseManager.standardResponse(
          'fail',
          400,
          'Validation failed',
          null,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    const firstError = validationErrors[0];
    const constraints = firstError?.constraints;

    const message =
      constraints && Object.values(constraints).length > 0
        ? Object.values(constraints)[0]
        : 'Validation error';

    return new HttpException(
      ResponseManager.standardResponse('fail', 400, message, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  public static standardResponseForPipeExceptions(
    error: string,
  ): HttpException {
    return new HttpException(
      ResponseManager.standardResponse('fail', 400, error, null),
      HttpStatus.BAD_REQUEST,
    );
  }
}
