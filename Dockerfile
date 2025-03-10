FROM ubuntu:22.04

# 添加镜像元数据
LABEL maintainer="BeilunYang"
LABEL org.opencontainers.image.title="MoePush"
LABEL org.opencontainers.image.description="一个基于 NextJS + Cloudflare 技术栈构建的可爱消息推送服务, 支持多种消息推送渠道✨"
LABEL org.opencontainers.image.source="https://github.com/beilunyang/moepush"
LABEL org.opencontainers.image.licenses="MIT"

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 安装必要的软件包
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# 安装 Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_23.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖
RUN pnpm install

# 复制 wrangler.example.json 到 wrangler.json
RUN cp wrangler.example.json wrangler.json

# 构建项目
RUN pnpm run pages:build

# 暴露端口
EXPOSE 8788

# 设置环境变量
ENV AUTH_SECRET=""
ENV AUTH_GITHUB_ID=""
ENV AUTH_GITHUB_SECRET=""

# 创建启动脚本
RUN echo '#!/bin/sh\n\
# 初始化或者更新数据库\n\
pnpm run db:migrate-local\n\
# 确保目录权限正确\n\
chmod -R 777 .wrangler\n\
# 启动应用\n\
pnpm wrangler pages dev .vercel/output/static --compatibility-flag nodejs_compat --ip 0.0.0.0\n\
' > /app/start.sh && chmod +x /app/start.sh

# 定义卷
VOLUME ["/app/.wrangler"]

# 设置启动命令
CMD ["/app/start.sh"]