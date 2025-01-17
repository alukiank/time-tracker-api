import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (key: keyof User, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return key ? req.user?.[key] : req.user;
  },
);
