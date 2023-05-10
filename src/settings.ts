export const settings = {
    PORT: process.env.PORT || 5000,

    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/",

    ADMIN_LOGIN: process.env.ADMIN_LOGIN,

    JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS_TOKEN || "AM5G47fC3AZ2QxBUZoxD",
    JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN || "VNKyGTgpeVetIiUFsymC",

    APP_URL: process.env.APP_URL || "https://127.0.0.1:5000",

    TECH_EMAIL: process.env.TECH_EMAIL || "",
    TECH_EMAIL_PASSWORD: process.env.TECH_EMAIL_PASSWORD || ""
}