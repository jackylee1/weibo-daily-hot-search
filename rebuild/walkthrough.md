# 🚀 Nodebase2 全栈开发实战：从零打造企业级应用

这份文档不仅仅是操作记录，更是一份 **"手把手教你写"** 的全栈开发教程。我们将带你从一个空白的 Next.js 项目开始，一步步构建出一个拥有 **类型安全 API**、**完整认证系统**、**数据库集成** 和 **后台任务处理** 的现代 Web 应用。

---

## 🏗️ 架构概览 (The Stack)

我们要打造的 "Nodebase Stack" 包含以下核心技术：

| 模块 | 技术选型 | 为什么选它？ |
| :--- | :--- | :--- |
| **框架** | **Next.js 15.5** (React 19) | 同时也使用了 **Turbopack**，开发启动速度极快。React 19 带来了 Server Actions 等新特性。 |
| **语言** | **TypeScript** | 全栈类型安全是我们的核心追求。 |
| **样式** | **Tailwind CSS v4** + **shadcn/ui** | v4 带来了极致的性能和新特性；shadcn 提供了可复制的高质量组件源码。 |
| **数据库** | **Prisma** + **PostgreSQL (Neon)** | Prisma 的类型推导体验无敌；Neon 提供了 Serverless Postgres。 |
| **API 层** | **tRPC** | **无 Fetch，无 Schema 定义**。前端直接调用后端函数，类型自动推导。 |
| **认证** | **Better-Auth** | 比 NextAuth 更现代化，支持插件系统，完美的 TypeScript 支持。 |
| **状态管理** | **TanStack Query** | 配合 tRPC 处理服务端状态，带缓存、自动重试。 |
| **后台任务** | **Inngest** | 处理异步任务、工作流、定时任务，Serverless 友好。 |

---

## 📝 Phase 1: 地基搭建 (Foundation)

**目标**：一个干净、现代、配置完美的 Next.js 开发环境。

### 1. 降级与环境锁定
虽然 Next.js 16 很新，但为了生态系统的最大兼容性（特别是某些 UI 库），我们将版本锁定在 **15.5.4**。

-   **修改 `package.json`**:
    ```json
    "next": "15.5.4",
    "react": "19.1.0",
    "react-dom": "19.1.0"
    ```
-   **启用 Turbopack**: 在 `scripts` 中添加 `"dev": "next dev --turbopack"`，启动速度提升 5-10 倍。

### 2. UI 系统：不写 CSS 的快乐
我们不需要手写 `.css` 文件。
1.  **Tailwind v4**: 在 `globals.css` 中直接使用 `@import "tailwindcss";`。
2.  **shadcn/ui**:
    -   配置 `components.json` 告诉它组件放哪。
    -   运行 `npx shadcn@latest add button card form ...`。
    -   这会在 `src/components/ui` 下生成组件源码，你可以随意修改它们！

### 3. 工具库
-   `src/lib/utils.ts`: 存放 `cn()` 函数，用于合并 Tailwind类名，这是这套 UI 系统的核心。

---

## 🗄️ Phase 2: 数据库接入 (Prisma)

**目标**：让应用拥有记忆。

### 1. Schema 设计 (`prisma/schema.prisma`)
这是数据库的"蓝图"。我们定义了 User 和 Workflow 模型。

### 2. 也是坑点：Prisma Client 配置
在 Next.js 开发环境中，频繁的热重载会导致 Prisma 报错。我们做了一个关键配置：

```prisma
generator client {
  provider = "prisma-client-js" // 显式指定 JS 客户端
  output   = "../src/generated/prisma" // 显式输出到 src，让 TypeScript 更好识别
}
```

### 3. 全局单例 (`src/lib/db.ts`)
防止 `npm run dev` 时连接数爆炸：
```typescript
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 🔐 Phase 3: 认证与 API (The Core)

这是全栈开发中最复杂也最精彩的部分。我们实现了 **"类型安全的一条龙"**。

### 1. 认证系统 (Better-Auth)
不再为了写个登录页折腾一周。
-   **服务端 (`lib/auth.ts`)**: 连接 Prisma，配置 Email/Password 登录。
-   **客户端 (`lib/auth-client.ts`)**: 一行代码生成 React Hooks (`useSession`, `signIn`).
-   **中间件 (`lib/auth-utils.ts`)**: `requireAuth()`，一行代码保护你的页面。

### 2. API 层 (tRPC)
这是前后端交互的革命。

-   **后端写函数 (`trpc/routers/_app.ts`)**:
    ```typescript
    getUsers: protectedProcedure.query(async ({ ctx }) => {
      return ctx.prisma.user.findMany();
    })
    ```
-   **前端直接调 (`app/page.tsx`)**:
    ```typescript
    // 根本不需要 fetch("/api/users")
    // 这里的 data 类型是自动推导的 User[]！
    const data = await caller.getUsers();
    ```

### 3. 页面实现
-   **(auth)/login**: 登录页。
-   **(auth)/signup**: 注册页。
-   **app/page.tsx**: 受保护的主页。如果未登录，服务器端直接 Redirect。

---

## ⚡ Phase 4: 异步与工作流 (Inngest)

**场景**：用户注册后要发邮件？要生成报表？这些耗时操作不能卡住主线程。

### 1. 什么是 Inngest？
它是一个"耐用"的事件驱动系统。你发送一个事件，它负责确保处理函数被执行，即使中间失败了也会重试。

### 2. 定义函数 (`src/inngest/functions.ts`)
```typescript
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" }, // 监听事件
  async ({ step }) => {
    // 这是一个多步骤工作流
    await step.sleep("wait-1", "5s"); // 休眠
    await step.run("write-db", async () => { ... }); // 写入数据库
  }
);
```

### 3. 启动全栈
我们配置了 `mprocs`，一个命令启动所有服务：
```bash
npm run dev:all
# 同时启动：
# 1. Next.js App (端口 3000)
# 2. Inngest Dev Server (端口 8288)
```

---

## 🎯 下一步建议

现在你手上有了一个企业级的全栈脚手架。你可以：
1.  **修改 Schema**: 在 `schema.prisma` 添加 `Post` 表，运行 `npx prisma migrate dev`。
2.  **添加 API**: 在 `_app.ts` 添加 `createPost` mutation。
3.  **开发前端**: 在 `page.tsx` 添加表单调用 createPost。

这就是现代全栈开发的全部流程！有问题随时问我。
