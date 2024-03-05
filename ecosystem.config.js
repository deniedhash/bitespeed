module.exports = {
  apps : [{
    name   : "bitespeed_app",
    script : "./api.js",
    instances: 1,
    exec_mode: 'cluster', 
    watch: true,
    out_file: "/dev/null",
    error_file: "/dev/null",
    env: {
        NODE_ENV: 'production',
      }
  }]
}