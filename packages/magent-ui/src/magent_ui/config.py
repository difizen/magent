# config_loader.py

import logging
import os
import importlib.util

logger = logging.getLogger('magent')

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
