module.exports = function (app) {
  var
    path = require('path'),
    fs = require('fs');

  // 遍历controllers文件夹，执行所有router文件
  function eachFiles(dir) {
    fs.readdirSync(dir).forEach(function (name) {
      if (path.extname(name) !== '') {
        require(path.join(dir, name))(app);
      } else if (name !== C.exceptFolder && name !== '.DS_Store') { // 如果是文件夹并且不等于排除目录，则递归继续往下找(".DS_Store"为mac缓存，这里特殊处理)
        eachFiles(path.join(dir, name));
      }
    })
  }

  // 后台检验是否登陆
  if (!F.argv.noauth) {
    app.all('/admin/*', function (req, res, next) {
      if (req.session.admin || req.path === '/admin/auth' || (req.path === '/admin/blogInfo' && req.method == 'GET') ) {
        next();
      } else {
        res.json({
          status: {
            code: 1,
            msg: '登陆失败'
          }
        });
      }
    });
  }

  // 遍历所有router
  eachFiles(C.dir.controller);

  // default
  app.use(function(req, res) {
    res.json({
      status: {
        code: 3,
        msg: '无此api'
      }
    })
  });
};