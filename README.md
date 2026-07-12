# 生命火花连接｜GitHub Pages 部署包

这是从主项目独立复制出的纯静态部署版本。它不包含数据库、Cloudflare Worker、登录模块或原项目的 Sites 托管配置，不会影响原项目。

## 本地运行

需要 Node.js 22 和 pnpm：

```bash
pnpm install
pnpm dev
```

打开终端显示的本地地址即可预览。

## 本地验证静态构建

```bash
pnpm build
pnpm start
```

静态文件会生成在 `out` 目录。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个空仓库，不要额外创建 README 或 `.gitignore`。
2. 把本目录中的全部文件复制到新仓库根目录，包括隐藏的 `.github` 和 `.gitignore`。
3. 提交并推送到 `main` 分支。
4. 打开仓库的 `Settings → Pages`，将 Source 选择为 `GitHub Actions`。
5. 打开仓库的 `Actions` 页面等待 `Deploy GitHub Pages` 完成。

网站地址通常为：

```text
https://你的用户名.github.io/仓库名/
```

以后每次向 `main` 分支推送代码，网站都会自动重新构建并发布。

## 命令行首次上传示例

```bash
git init
git add .
git commit -m "Initial GitHub Pages site"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```
