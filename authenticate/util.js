module.exports = { extractCredentials(token) {
  if (token === undefined) throw new Error("no auth header");
  const [type, hash] = token.split(" ");
  //console.log(`${type} : ${hash}`);
  if (type !== "Basic") throw new Error("wrong auth type");
  const str = Buffer.from(hash, 'base64').toString();
  //console.log(str);
  if (str.indexOf(":") === -1) throw new Error("invalid auth format");
  const [user, pass] = str.split(":");
  //console.log(user);
  //console.log(pass);
  return { user, pass };
}
}