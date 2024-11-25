from typing import Any, Dict, Sequence
from langchain_core.messages import HumanMessage
from langchain_core.runnables import Runnable, RunnableBinding
from .langchain_adaptor import RunnableAdaptor
from .utils import is_community_installed, is_in_array_or_has_prefix


tongyi_models = [
    "qwen-max",
    "qwen-plus",
    "qwen-turbo",
    "qwen-long",
    "qwen-vl-max",
    "qwen-vl-plus",
    "qwen-vl-ocr",
    "qwen-math-plus",
    "qwen-audio-turbo",
    "qwen-coder-plus",
    "qwen-coder-turbo",
    "qwen"
]


class TongyiAdaptor(RunnableAdaptor):
    @staticmethod
    def recognizer(object, llm_type: str | None = None):
        if not isinstance(object, Runnable):
            return False
        if llm_type == 'tongyi':
            return True
        if isinstance(object, RunnableBinding):
            return TongyiAdaptor.recognizer(object.bound)
        if not is_community_installed():
            return False
        from langchain_community.chat_models.tongyi import ChatTongyi
        if isinstance(object, ChatTongyi):
            return is_in_array_or_has_prefix(tongyi_models, object.model_name)
        return False

    def to_input_message(self, value, image=None):
        content: Sequence[str | Dict[str, Any]] = [{"text": value}]
        if image is not None:
            content.append({"image": image})
        message = HumanMessage(content=content)  # type: ignore
        return [message]
