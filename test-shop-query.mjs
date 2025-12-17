import fetch from 'node-fetch';

const url = 'http://localhost:3000/api/trpc/products.list?input=' + encodeURIComponent(JSON.stringify({
  json: {
    page: 1,
    limit: 12
  }
}));

console.log('Testing URL:', url);

const response = await fetch(url);
const data = await response.json();

console.log('Status:', response.status);
console.log('Response:', JSON.stringify(data, null, 2));
