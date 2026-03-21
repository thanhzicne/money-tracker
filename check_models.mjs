import fs from 'fs';
const key = "AIzaSyDrVYXZpd2odAgQoNfwJV6d3EgPGlm94cg";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    fs.writeFileSync('models.txt', JSON.stringify(data, null, 2));
  })
  .catch(err => fs.writeFileSync('models.txt', err.toString()));
