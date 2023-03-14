export default () => ({
  port: process.env.PORT || 4000,
  database: process.env.DB_URL,
});
