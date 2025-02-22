import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserDecorator {
  id: string;
  email: string;
  // ... otros campos necesarios
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDecorator => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
); 