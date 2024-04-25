const bcrypt = require("bcryptjs")

let hash = bcrypt.hashSync("my password", 10)
console.log(hash);

let psw1 = "my password";
let psw2 = "my password2";

console.log(bcrypt.compareSync(psw1, hash))
console.log(bcrypt.compareSync(psw2, hash))

