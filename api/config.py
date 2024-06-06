import os

DEFAULTS = {
    'SQLALCHEMY_POOL_SIZE': 30,
    'SQLALCHEMY_MAX_OVERFLOW': 10,
    'SQLALCHEMY_POOL_RECYCLE': 3600,
    'SQLALCHEMY_ECHO': 'False',
    "DB_USERNAME": "postgres",
    "DB_PASSWORD": "magent123456",
    "DB_HOST": "localhost",
    "DB_PORT": "5432",
    "DB_DATABASE": "magent",
    "DB_CHARSET": "",
}


def get_env(key) -> str | int:
    value = os.environ.get(key, DEFAULTS.get(key))
    if value is None:
        return ""
    return value


def get_bool_env(key):
    value = get_env(key)
    return value.lower() == "true" if value is not None else False


class Config:
    def __init__(self):
        # ------------------------
        # Database Configurations.
        # ------------------------
        db_credentials = {
            key: get_env(key)
            for key in [
                "DB_USERNAME",
                "DB_PASSWORD",
                "DB_HOST",
                "DB_PORT",
                "DB_DATABASE",
                "DB_CHARSET",
            ]
        }

        db_extras = (
            f"?client_encoding={db_credentials['DB_CHARSET']}"
            if db_credentials["DB_CHARSET"]
            else ""
        )

        self.SQLALCHEMY_DATABASE_URI = f"postgresql://{db_credentials['DB_USERNAME']}:{db_credentials['DB_PASSWORD']}@{db_credentials['DB_HOST']}:{db_credentials['DB_PORT']}/{db_credentials['DB_DATABASE']}{db_extras}"
        self.SQLALCHEMY_ENGINE_OPTIONS = {
            "pool_size": int(get_env("SQLALCHEMY_POOL_SIZE")),
            "max_overflow": int(get_env("SQLALCHEMY_MAX_OVERFLOW")),
            "pool_recycle": int(get_env("SQLALCHEMY_POOL_RECYCLE")),
        }

        self.SQLALCHEMY_ECHO = get_bool_env("SQLALCHEMY_ECHO")


config = Config()
