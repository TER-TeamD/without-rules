import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
    uri: process.env.DATABASE_URI,
}));
