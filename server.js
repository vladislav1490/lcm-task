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
    return a * (b / gcd(a, b));
}

function isNaturalNumber(value) {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
}

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] Новый запрос: ${req.method} ${req.url}`);

    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;
    const requiredPathEnd = `/${sanitizeEmail(MY_EMAIL)}`;

    console.log(` - Разобранный путь: ${pathname}`);
    console.log(` - Параметры запроса (query): x=${query.x}, y=${query.y}`);
    console.log(` - Ожидаемое окончание пути: ${requiredPathEnd}`);

    if (req.method === 'GET' && pathname.endsWith(requiredPathEnd)) {
        console.log("   -> Путь СОВПАЛ. Проверяем параметры.");
        const { x, y } = query;

        if (!isNaturalNumber(x) || !isNaturalNumber(y)) {
            console.log(`     -> Параметры НЕВЕРНЫЕ (x=${x}, y=${y}). Отдаю 'NaN'.`);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('NaN');
            return;
        }

        const result = lcm(Number(x), Number(y));
        console.log(`     -> Параметры ВЕРНЫЕ. Результат НОК: ${result}. Отдаю результат.`);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(String(result));
    } else {
        console.log("   -> Путь НЕ СОВПАЛ. Отдаю 404 'Not Found'.");
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`[INFO] Сервер запущен на порту ${PORT}.`);
});