  var gulp = require("gulp");

  var shell = require("gulp-shell");

  gulp.task("serve", shell.task("nodemon server.js"));

  gulp.task("lint", shell.task("jshint *.js **/*.js"));

  gulp.task("pruebas", shell.task("npm test"));
  gulp.task("documentacion", shell.task("docco lib/ldj-client2.js"));
  gulp.task("custom-client", shell.task("node src/net-watcher-json-client.js"));
  gulp.task("custom-test-service", shell.task("node src/test-json-service.js"));
  gulp.task("json-service", shell.task("node src/net-watcher-json-service.js src/target.txt"));
  gulp.task("connect-nc", shell.task("nc localhost 60300"));
  gulp.task("connect-telnet", shell.task("telnet localhost 60300"));
  gulp.task("connect-socket", shell.task("nc -U /tmp/watcher.sock"));
  gulp.task("connection-unix", shell.task("node src/net-watcher-unix.js src/target.txt"));
  gulp.task("watch-repeatedly", shell.task("watch -n 1 touch src/target.txt"));

  gulp.task("documentation", shell.task("documentation build lib/ldj-client2.js -f md > documentation.md"))


