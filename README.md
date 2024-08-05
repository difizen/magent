# magent

## 开发

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
poetry install
```

安装完成后，which python 检查当前环境确认已经使用虚拟环境

```shell
cd sample_standard_app
# 复用虚拟环境
poetry env use python
poetry install
```

启动服务

```shell
cd sample_standard_app/app/bootstrap
python product_application.py
```
