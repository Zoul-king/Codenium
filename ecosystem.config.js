module.exports = {
  apps: [
    {
      name: "codenium",
      cwd: "/var/www/codenium",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};