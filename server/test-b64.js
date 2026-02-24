const buf = Buffer.from("");
console.log(buf.length);
console.log(buf.toString('base64') === "");
console.log(!buf.toString('base64'));
