export const settings = {
    PORT: process.env.PORT || 5000,

    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/",
    DB_NAME: process.env.DB_NAME || '',

    ADMIN_LOGIN: process.env.ADMIN_LOGIN || '',

    JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS_TOKEN || "AM5G47fC3AZ2QxBUZoxD",
    JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN || "VNKyGTgpeVetIiUFsymC",

    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '10s',
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '20s',

    APP_URL: process.env.APP_URL || "https://127.0.0.1:5000",

    TECH_EMAIL: process.env.TECH_EMAIL || "",
    TECH_EMAIL_PASSWORD: process.env.TECH_EMAIL_PASSWORD || "",

    MAX_COUNT_FREQUENT_REQUESTS_FOR_API: process.env.MAX_COUNT_FREQUENT_REQUESTS_FOR_API ? +process.env.MAX_COUNT_FREQUENT_REQUESTS_FOR_API : 5,
    QUERY_CHECKING_TIME: process.env.QUERY_CHECKING_TIME ? +process.env.QUERY_CHECKING_TIME : 10,

    CODE_LIFE_TIME: { hours: 1 }
}