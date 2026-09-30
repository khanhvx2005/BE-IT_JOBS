
import {
  ExecutionContext,
  Inject,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // Đọc metadata từ method trước, rồi tới class (controller)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Có nhãn @Public() → bỏ qua Passport, cho đi thẳng
    if (isPublic) {
      return true;
    }

    // Không có nhãn → chạy JwtStrategy như bình thường
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException("Token không hợp lệ");
    }
    return user;
  }
}
