<p align="center">
  <img src="public/logo.png" alt="MoePush Logo" width="100" height="100">
  <h1 align="center">MoePush</h1>
</p>

<p align="center">
  一个基于 NextJS + Cloudflare 技术栈构建的可爱消息推送服务, 支持多种消息推送渠道✨
</p>

## 在线演示

[https://moepush.app](https://moepush.app)

![home](https://pic.otaku.ren/20250221/AQAD5b8xG9vVwFV-.jpg)

![login](https://pic.otaku.ren/20250221/AQAD678xG9vVwFV-.jpg)

![dashboard](https://pic.otaku.ren/20250221/AQAD7b8xG9vVwFV-.jpg)

## 特性

- 📡**多渠道支持** ：支持钉钉、企业微信、Telegram 等多种消息推送渠道。
- 🛠️**简单易用** ：提供简单的接口调用，支持多种消息模板，快速集成。
- 💖**开源免费** ：基础功能完全免费使用，代码开源，欢迎贡献。
- 🎨**精美 UI** ：使用 shadcn/ui 组件库，提供精美 UI 设计。
- 🚀**快速部署** ：基于 [Cloudflare Pages](https://pages.cloudflare.com/) 部署，免费且稳定。

## 已支持渠道

- 钉钉群机器人
- 企业微信应用
- 企业微信群机器人
- Telegram 机器人
- 飞书群机器人

## 技术栈
- **框架**: [Next.js](https://nextjs.org/) (App Router)
- **平台**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **数据库**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **认证**: [NextAuth](https://authjs.dev/getting-started/installation?framework=Next.js) 配合 GitHub 登录
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件**: 基于 [Radix UI](https://www.radix-ui.com/) 的自定义组件
- **类型安全**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)

## 本地运行

1. 克隆项目并安装依赖：

```bash
git clone https://github.com/beilunyang/moepush.git
cd moepush
pnpm install
```

2. 复制环境变量文件：

```bash
cp .env.example .env
```

环境变量文件 `.env` 中需要配置以下变量：

- `AUTH_SECRET`：加密 Session 的密钥
- `AUTH_GITHUB_ID`：GitHub OAuth App ID
- `AUTH_GITHUB_SECRET`：GitHub OAuth App Secret
- `DISABLE_REGISTER`：是否禁止注册，默认关闭，设置为 `true` 则禁止注册

3. 运行开发服务器：

```bash
pnpm run dev
```

访问 http://localhost:3000 查看应用。

## 部署

### GitHub Actions 自动部署

项目已配置 GitHub Actions 用于自动部署, 可以通过两种方式进行触发：

- 推送新的 tag（格式：`v*`）会触发自动部署。例如：`git tag v1.0.0 && git push origin v1.0.0`
- 手动触发工作流。前往 [Actions](https://github.com/beilunyang/moepush/actions) 页面，点击 `Deploy` 工作流，点击 `Run workflow` 按钮即可。

### 部署前需要在 GitHub 仓库设置中添加以下 Secrets：
- `CLOUDFLARE_API_TOKEN`：Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Account ID
- `D1_DATABASE_NAME`：D1 数据库名称
- `AUTH_SECRET`：加密 Session 的密钥
- `AUTH_GITHUB_ID`：GitHub OAuth App ID
- `AUTH_GITHUB_SECRET`：GitHub OAuth App Secret
- `PROJECT_NAME`：项目名称 (可选，默认：moepush)
- `DISABLE_REGISTER`：是否禁止注册，默认关闭，设置为 `true` 则禁止注册

## 贡献

欢迎提交 Pull Request 或者 Issue来帮助改进这个项目

## 交流群
<img src="https://pic.otaku.ren/20250221/AQAD8b8xG9vVwFV-.jpg" style="width: 400px;"/>
<br />
如二维码失效，请添加我的个人微信（hansenones），并备注 "MoePush" 加入微信交流群

## 支持

如果你喜欢这个项目，欢迎给它一个 Star ⭐️
或者进行赞助
<br />
<br />
<img src="https://pic.otaku.ren/20240212/AQADPrgxGwoIWFZ-.jpg" style="width: 400px;"/>
<br />
<br />
<a href="https://www.buymeacoffee.com/beilunyang" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="width: 400px;" ></a>

## 许可证

[MIT](LICENSE)
