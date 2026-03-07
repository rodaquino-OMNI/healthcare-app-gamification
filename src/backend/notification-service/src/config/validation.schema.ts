/* eslint-disable */
import Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
    PORT: Joi.number().default(3000),
    EMAIL_PROVIDER: Joi.string().required(),
    EMAIL_API_KEY: Joi.string().required(),
    EMAIL_DEFAULT_FROM: Joi.string().required(),
    PUSH_API_KEY: Joi.string().required(),
    SMS_ACCOUNT_SID: Joi.string().required(),
    SMS_AUTH_TOKEN: Joi.string().required(),
    SMS_DEFAULT_FROM: Joi.string().required(),
    WEBSOCKET_PORT: Joi.number().default(3001),
});
