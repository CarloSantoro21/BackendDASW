const jwt = require("jsonwebtoken")

let token = jwt.sign({ userEmail: 'test@test.com' }, 'password to sing tokens');

console.log(token);

jwt.verify(token, 'password to sing tokens', function(err, decoded) {
    console.log(decoded.userEmail);
  });