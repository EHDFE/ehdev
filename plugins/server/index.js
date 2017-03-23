const path = require('path');

const Koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const proxy = require('koa-proxies');
const opn = require('opn');

const devServer = new Koa();

const projectRoot = process.cwd();
const config = require(path.join(projectRoot, 'abc.json'));

function makeServeByConfig() {
  const workspace = config.workspace;
  Object.keys(workspace).forEach(moduleName => {
    const c = workspace[moduleName];
    const relativePath = c.relativePath || '';
    if (c.active) {
      // active current project
      if (c.route) {
        devServer.use(mount(c.route, serve(path.join(projectRoot, moduleName, c.branch, relativePath))));
      } else {
        devServer.use(mount(`/${moduleName}`, serve(path.join(projectRoot, moduleName, c.branch, relativePath))));
      }
    }
  });
}

/**
 * 现在 SCRM 会在页面中指定baseUrl，会在开发环境中直接以根path引用当前模块下的资源
 * TODO: 后续应该去掉这个逻辑
 */
function proxyRootAssets() {
  const workspace = config.workspace;
  const rootModule = workspace[config.root_path];
  if (rootModule) {
    devServer.use(mount(`/`, serve(path.join(projectRoot, config.root_path, rootModule.branch, rootModule.relativePath || ''))));
  }
}

function makeProxyByConfig() {
  const proxyConfig = config.proxy;
  Object.keys(proxyConfig).forEach(path => {
    const c = proxyConfig[path];
    devServer.use(proxy(path, {
      target: c.proxy_pass,
      changeOrigin: true,
      logs: true,
    }));
  });
}

makeServeByConfig();
// proxyRootAssets();
makeProxyByConfig();

devServer.listen(3000);

// opn('http://localhost:3000/scms/trunk/index.html');