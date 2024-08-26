# 开发

### 安装依赖

```shell
# 前端工程初始化
pnpm bootstrap

# python 工程初始化
rye sync
```

### magent-ui

#### 启动 magent-ui 前端

```shell
pnpm run dev:ui
```

#### 构建和发布 magent-ui 前端

```shell
cd web/ui

# 构建
pnpm run build

# 发布到 python 工程
pnpm run deploy
```

#### 启动 magent-ui 服务端

进入 agentUniverse 工程

在根目录工程和 sample 工程使用相同的虚拟环境安装依赖

agentuniverse 使用 poetry 做包管理，需要创建对应的虚拟环境

```shell
poetry lock # 初始化 venv
source .venv/bin/activate # 使用虚拟环境
poetry install #安装主依赖（主目录安装会将本地包加入虚拟环境）
```

在 sample 目录启动应用，如果缺少依赖，回到主目录安装，在 sample 安装依赖会破坏本地依赖

```shell
cd sample_standard_app/app/bootstrap
python product_application.py
```
