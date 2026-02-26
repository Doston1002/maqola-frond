module.exports = {
    apps: [
      {
        name: 'uyda-talim-front',
        script: 'yarn',
        args: 'start',
        env: {
          NODE_ENV: 'production',
          PORT: 3000
        }
      }
    ]
  };