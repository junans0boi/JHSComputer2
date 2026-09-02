import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY, ROLES_KEY } from './index';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
