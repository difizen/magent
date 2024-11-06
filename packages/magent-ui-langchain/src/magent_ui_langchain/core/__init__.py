from .adapter_registry import adapter_registry
from .langchain_executor import LLMStreamExecutor, ChainStreamExecutor, RunnableStreamExecutor


adapter_registry.register_adapter(
    LLMStreamExecutor.recognizer, LLMStreamExecutor, 1)


adapter_registry.register_adapter(
    ChainStreamExecutor.recognizer, ChainStreamExecutor, 1)


adapter_registry.register_adapter(
    RunnableStreamExecutor.recognizer, RunnableStreamExecutor)
