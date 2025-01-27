import { HttpCode } from "../resource/http-code";


export class ErrorModel {
  code: number;
  message: string;
  body: any;

  constructor(code?: number, message?: string, body?: any) {
    this.code = code ?? HttpCode.UNKNOWN;
    this.message = message ?? 'UNKNOWN';
    this.body = body;
  }
}
