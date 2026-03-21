import fs from 'fs';

const key = "AIzaSyDrVYXZpd2odAgQoNfwJV6d3EgPGlm94cg";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

async function run() {
  const output = {};
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
    });
    output.status = res.status;
    output.response = await res.text();
  } catch (err) {
    output.error = err.message;
  }
  fs.writeFileSync('api_result.json', JSON.stringify(output, null, 2));
}

run();
