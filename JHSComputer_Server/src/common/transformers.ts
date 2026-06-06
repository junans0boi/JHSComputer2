import { ValueTransformer } from 'typeorm';

export const BooleanTransformer: ValueTransformer = {
  to: (value: boolean | null): string | null => {
    if (value === null) return null;
    return value ? 'Y' : 'N';
  },
  from: (value: string | null): boolean | null => {
    if (value === null) return null;
    return value === 'Y';
  },
};
