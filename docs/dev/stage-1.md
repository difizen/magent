# 基础

## 鉴权

目前鉴权能力尚不完善，考虑使用 jwt 处理接口验证

# 内核

目前使用了基于 langchain 的内核，优先提供流式交互。
考虑引入 agentUniverse 能力，并优先基于 agentUniverse 开发

## 模型

暂时不引入模型相关的持久化数据，前后端分别基于模型的`key`实现对应能力。

## agent

考虑 devOps 的可能，默认将所有配置保存为 JSON 信息，这也同时保证了相关数据结构在前期的轻量化。

# TODO

## major

- [ ] 插件
- [ ] 知识库
- [ ] workflow
- [ ] notebook flow
- [ ] agentUniverse base
- [ ] 卡片

## minor

- [ ] (api) 升级鉴权访问方案，目前没有登录验证
- [ ] (api) 调研 jwt 与 session，增加一种满足鉴权与获取用户凭证的需求
- [ ] (api) 数据库部主键改用 uuid
- [ ] (app) 模型配置增加参数表单，支持扩展类型
- [ ] (app) 模型部分增加 model provider 为后端获取模型增加路径

## patch

- [ ] (app) 对话框在输入信息后，先回显用户和机器人的等待状态，让交互更流畅
- [ ] (app) 对话能力支持中断操作
