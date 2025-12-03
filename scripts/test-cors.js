const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET',
  headers: {
    'Origin': 'http://localhost:5173'
  }
};

const req = http.request(options, (res) => {
  console.log('statusCode', res.statusCode);
  console.log('headers', res.headers);
  var data = '';
  res.on('data', (d) => { data += d; });
  res.on('end', () => { console.log('body', data); });
});

req.on('error', (e) => {
  console.error('error', e);
});
req.end();
