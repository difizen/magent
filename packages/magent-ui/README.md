# magent_ui

## agentUniverse

与 [agentUniverse](https://github.com/alipay/agentUniverse) 联合推出本地研发产品化方案，详见[产品化文档](https://github.com/alipay/agentUniverse/blob/master/docs/guidebook/zh/10_1_1_%E4%BA%A7%E5%93%81%E5%8C%96%E5%B9%B3%E5%8F%B0%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B.md)

PEER 多智能体对话
![PEER 多智能体对话](../../docs/assets/au-peer-chat.jpg)

reAct 智能体开发
![reAct 智能体开发](../../docs/assets/au-react-dev.jpg)

### 配置

支持 uvicorn 配置

```python
from magent_ui import launch
launch(host='0.0.0.0', port=8888, root_path='/')
```

#### 配置文件

- 用户级配置： ~/.magent/ui_config.py
- 项目级配置： {project_root}/.magent_ui_config.py
- 项目级配置： {project_root}/config/magent_ui_config.py

#### 环境变量

MAGENT_UI_SERVER_XX
