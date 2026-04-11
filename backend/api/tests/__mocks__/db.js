// Stub for db/knex — prevents real DB instantiation during tests.
// Services are mocked at the test level so this module is never called,
// but it must be require-able without throwing.
module.exports = () => ({});
