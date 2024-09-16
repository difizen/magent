import warnings
from pydantic_settings import BaseSettings
from pydantic_core import MultiHostUrl
from typing import Literal
from typing_extensions import Self

from pydantic import (
    PostgresDsn,
    computed_field,
    model_validator,
)


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    DEFAULT_LANGUAGE: str = 'zh_cn'
    DEFAULT_THEME: str = 'light'

    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    SQLALCHEMY_POOL_SIZE: int = 30
    SQLALCHEMY_MAX_OVERFLOW: int = 10
    SQLALCHEMY_POOL_RECYCLE: int = 3600
    SQLALCHEMY_ECHO: bool = False

    POSTGRES_SERVER: str = 'localhost'
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = 'postgres'
    POSTGRES_PASSWORD: str = 'magent123456'
    POSTGRES_DB: str = 'magent'

    FIRST_SUPERUSER: str = 'default@magent.com'
    FIRST_SUPERUSER_PASSWORD: str = 'magent123456'
    FIRST_SUPERUSER_AVATAR: str = 'https://api.dicebear.com/7.x/miniavs/svg?seed=1'

    @computed_field  # type: ignore[misc]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+psycopg2",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    def _check_default_secret(self, var_name: str, value: str | None) -> None:
        if value == "changethis":
            message = (
                f'The value of {var_name} is "changethis", '
                "for security, please change it, at least for deployments."
            )
            if self.ENVIRONMENT == "local":
                warnings.warn(message, stacklevel=1)
            else:
                raise ValueError(message)

    @model_validator(mode="after")
    def _enforce_non_default_secrets(self) -> Self:
        self._check_default_secret("POSTGRES_PASSWORD", self.POSTGRES_PASSWORD)
        self._check_default_secret(
            "FIRST_SUPERUSER_PASSWORD", self.FIRST_SUPERUSER_PASSWORD
        )

        return self


settings = Settings()
