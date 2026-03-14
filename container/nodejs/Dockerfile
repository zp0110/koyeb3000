# ── 阶段一：安装依赖 ────────────────────────────────────────────
FROM oven/bun:1 AS deps
WORKDIR /app

# 只复制依赖声明文件，利用 Docker 层缓存
# 只要 package.json 不变，这一层就不会重新执行
COPY package.json .
RUN bun install --production --frozen-lockfile

# ── 阶段二：运行镜像 ────────────────────────────────────────────
FROM oven/bun:1-slim AS runner
WORKDIR /app

# 从构建阶段复制已安装的依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制业务代码
COPY index.js .

# 声明端口（Koyeb 会读取这个值）
EXPOSE 3000

# 用 bun 替代 node 运行
CMD ["bun", "index.js"]
