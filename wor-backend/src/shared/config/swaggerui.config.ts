import { registerAs } from '@nestjs/config';

export default registerAs('swaggerui', () => ({
  path: '/doc',
  title: 'Documentation',
  description: 'Backend - 6 qui prend',
}));
