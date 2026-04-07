// Entry point — starts the HTTP server.
// app.js configures Express; this file just binds it to a port.
// PORT defaults to 8080 if not set in the environment.
const server = require('./app.js');

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
