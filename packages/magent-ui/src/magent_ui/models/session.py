# !/usr/bin/env python3
# -*- coding:utf-8 -*-

# @Time    : 2024/7/26 14:26
# @Author  : wangchongshi
# @Email   : wangchongshi.wcs@antgroup.com
# @FileName: session_dto.py
from typing import Optional

from pydantic import BaseModel, Field

from magent_ui.models.message import Message

class Session(BaseModel):
    id: str = Field(description="ID")
    agent_id: str = Field(description="session agent id")
    messages: Optional[list[Message]] = Field(description="session messages", default=[])
    gmt_created: Optional[str] = Field(description="session create time")
    gmt_modified: Optional[str] = Field(description="session update time")
