# config_loader.py

import logging
import os
import importlib.util
from pathlib import Path

logger = logging.getLogger("uvicorn")

default_config = {
    'host': '0.0.0.0',
    'port': 8888,
    'base_url': None,
    'open_browser': True,
    'log_level': None,
    'root_path': '/'
}


def to_uvicorn_config(config: dict):
    uvicorn_config = {**config}
    # remove unsupported config key
    del uvicorn_config['base_url']
    del uvicorn_config['open_browser']
    del uvicorn_config['log_level']

    # root path has already taken effect
    del uvicorn_config['root_path']


    return uvicorn_config


def load_config_from_file(file_path):
    spec = importlib.util.spec_from_file_location("user_config", file_path)
    if spec is not None:
        config_module = importlib.util.module_from_spec(spec)
        if spec.loader is not None:
            spec.loader.exec_module(config_module)
            return {key: getattr(config_module, key) for key in dir(config_module) if not key.startswith('_')}
    return {}


def load_config_from_env(default_config, prefix='MAGENT_UI_SERVER'):
    env_config = {}
    for key, value in default_config.items():
        if isinstance(value, dict):
            env_config[key] = load_config_from_env(
                value, f"{prefix}_{key.upper()}")
        else:
            env_var = f"{prefix}_{key.upper()}"
            env_value = os.getenv(env_var)
            if env_value is not None:
                if isinstance(value, bool):
                    env_value = env_value.lower() in ['true', '1', 'yes']
                elif isinstance(value, int):
                    env_value = int(env_value)
                env_config[key] = env_value
    return env_config


def merge_dicts(default, override):
    for key, value in override.items():
        if isinstance(value, dict) and key in default:
            default[key] = merge_dicts(default[key], value)
        else:
            default[key] = value
    return default


def load_config(config=default_config, project_root_path=None):
    config = merge_dicts(default_config, config)

    # 用户目录配置文件路径
    user_config_path = os.path.expanduser('~/.magent/ui_config.py')

    # 加载用户目录配置文件
    if os.path.exists(user_config_path):
        user_config = load_config_from_file(user_config_path)
        logger.info(
            f"Load user config from {user_config_path}.")
        config = merge_dicts(config, user_config)

    # 工作目录配置文件路径
    if project_root_path is None:
        project_root_path = os.getcwd()

    # 加载项目根目录配置文件
    project_config_path = os.path.join(
        project_root_path, 'config/magent_ui_config.py')
    if os.path.exists(project_config_path):
        project_config = load_config_from_file(project_config_path)
        logger.info(
            f"Load project config from {project_config_path}.")
        config = merge_dicts(config, project_config)

    project_root_config_path = os.path.join(
        project_root_path, '.magent_ui_config.py')
    if os.path.exists(project_root_config_path):
        project_config = load_config_from_file(project_root_config_path)
        logger.info(
            f"Load project config from {project_config_path}.")
        config = merge_dicts(config, project_config)

    # 加载环境变量配置
    env_config = load_config_from_env(default_config)
    if len(env_config.keys()):
        logger.info("Load env config.")
    config = merge_dicts(config, env_config)

    return config


api_path = 'api'
static_path = 'static'
resource_path = 'resources'
app_path = 'app'

class AppConfig():
  config: dict
  project_root_path:Path
  resource_dir_path: Path

  port: int
  root_path: str
  base_url: str
  open_browser: bool
  log_level: str

  full_api_path: str
  full_static_path: str
  full_resource_path: str

  api_url: str
  static_url: str
  resource_url: str
  app_url: str

  def load_config(self, project_root_path:Path, **kwargs):
      config = load_config(kwargs, project_root_path)
      self.project_root_path = project_root_path
      self.resource_dir_path = project_root_path / 'app' / 'resources'
      self.config = config
      self.port = config.get('port', 8888)
      base_root_path = '/'
      root_path = config.get('root_path', base_root_path)
      self.root_path = root_path
      self.base_url = config.get('base_url', None)
      self.open_browser = config.get('open_browser', True)
      self.log_level = config.get('log_level', None)
      if self.base_url is None:
          self.base_url = root_path

      if not root_path.startswith('/'):
        logger.info('[magent] root_path should start with "/" ', root_path)
        root_path = f'/{root_path}'
        config['root_path'] = root_path

      self.full_api_path = os.path.join(root_path, api_path)
      self.full_static_path = os.path.join(root_path, static_path)
      self.full_resource_path = os.path.join(root_path, resource_path)

      self.api_url = os.path.join(self.base_url, api_path)
      self.static_url = os.path.join(self.base_url, static_path)
      self.resource_url = os.path.join(self.base_url, resource_path)
      self.app_url = os.path.join(self.base_url, app_path)


app_config = AppConfig()
