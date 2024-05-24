// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    SECRET_KEY: process.env.SECRET_KEY,
    JWT_PASS: process.env.JWT_PASS,
    USER_CPF: process.env.USER_CPF,
    USER_FULLNAME: process.env.USER_FULLNAME,
    USER_PASSWORD: process.env.USER_PASSWORD,
    USER_PHONENUMBER: process.env.USER_PHONENUMBER,
    HOST: process.env.HOST,
    OWNER_CPF: process.env.OWNER_CPF,
    OWNER_RG: process.env.OWNER_RG
  },
};

module.exports = nextConfig;
