import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PaginatedData<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload) => {
        const timestamp = new Date().toISOString();
        if (payload && typeof payload === 'object' && 'meta' in payload && 'data' in payload) {
          const p = payload as PaginatedData<unknown>;
          return { success: true, data: p.data, meta: p.meta, message: 'OK', timestamp };
        }
        return { success: true, data: payload, message: 'OK', timestamp };
      }),
    );
  }
}
