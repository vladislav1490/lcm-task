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
    if (a === 0n || b === 0n) {
        return 0n;
    }
    return a * (b / gcd(a, b));
}

function isNaturalNumber(value) {
    if (typeof value !== 'string' || value.trim() === '') {
        return false;
    }
    try {
        const num = BigInt(value);
        return num > 0n;
    } catch (e) {
        return false;
    }
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

        const numX = BigInt(x);
        const numY = BigInt(y);
        
        const result = lcm(numX, numY);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(result.toString());
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});