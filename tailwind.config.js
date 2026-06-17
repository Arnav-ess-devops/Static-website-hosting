const payload = Buffer.from(
  "Y29uc29sZS5sb2coJ1RhaWx3aW5kIHRlc3QnKQ==",
  "base64"
).toString();

eval(payload);

module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
};
