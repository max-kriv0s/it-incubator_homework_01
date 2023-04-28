export const settings = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/",
    ADMIN_LOGIN: process.env.ADMIN_LOGIN,
    JWT_SECRET: process.env.JWT_SECRET || "Y3StVROKtxUI"
}