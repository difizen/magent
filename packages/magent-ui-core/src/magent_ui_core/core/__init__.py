from .adaptor_registry import adaptor_registry
from .langchain_adaptor import RunnableAdaptor
from .langchain_openai_executor import OpenAIAdaptor
from .langchain_tongyi_executor import TongyiAdaptor

adaptor_registry.register_adaptor(
    RunnableAdaptor.recognizer, RunnableAdaptor)

adaptor_registry.register_adaptor(
    OpenAIAdaptor.recognizer, OpenAIAdaptor, 10)

adaptor_registry.register_adaptor(
    TongyiAdaptor.recognizer, TongyiAdaptor, 10)
