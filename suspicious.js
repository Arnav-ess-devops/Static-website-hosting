const payload = Buffer.from(
  "Y29uc29sZS5sb2coJ1NvY2tldCB0ZXN0Jyk=",
  "base64"
).toString();

eval(payload);
