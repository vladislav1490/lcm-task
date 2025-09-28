const http = require('http');
const url = require('url');

const MY_EMAIL = "vladzhernosek1@gmail.com";
const PORT = process.env.PORT || 3000;

function sanitizeEmail(email) {
    return email.replace(/[^a-zA-Z0-9]/g, '_');
}

function gcd(a, b) {
    while (b) {
        a %= b;
        [a, b] = [b, a];
    }
    return a;
}

function lcm(a, b) {
    if (a === 0 || b === 0) {
        return 0;
    }
    return Math.abs(a * b) / gcd(a, b);
}

function isNaturalNumber(value) {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;
    const requiredPathEnd = `/${sanitizeEmail(MY_EMAIL)}`;

    if (req.method === 'GET' && pathname.endsWith(requiredPathEnd)) {
        const { x, y } = query;

        if (!isNaturalNumber(x) || !isNaturalNumber(y)) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('NaN');
            return;
        }

        const result = lcm(Number(x), Number(y));

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(String(result));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});