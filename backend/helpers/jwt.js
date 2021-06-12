const expressJWT = require("express-jwt");

function authenticateJWT() {
    const secret = process.env.SECRET_KEY;
    const api = process.env.API_URL;
    return expressJWT({
        secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked,
    }).unless({
        path: [
            { url: `${api}/product/`, methods: ["GET", "OPTION"] },
            { url: `${api}/user/`, methods: ["GET", "OPTION"] },
            `${api}/user/login`,
            `${api}/user/register`,
        ],
    });
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true);
    }

    done();
}

module.exports = authenticateJWT;
