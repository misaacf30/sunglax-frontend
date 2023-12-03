const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/api/Auth",
    "/api/Product",
    "/api/Stripe/session/create",
    "/api/Stripe/session/getStatus",
    "/api/Stripe/customer/add",
    "/api/Order"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7222',
        secure: false
    });

    app.use(appProxy);
};
