# import sys
# sys.path.append("/Users/johnny/Code/difizen/magent/packages/magent-ui-langchain/src")
# from langchain_openai import ChatOpenAI
from magent_ui_langchain import launch

from langchain_community.chat_models.tongyi import ChatTongyi

tongyi_chat = ChatTongyi(
    model="qwen-vl-max",
    max_retries=2,
)  # type: ignore

launch(tongyi_chat)
