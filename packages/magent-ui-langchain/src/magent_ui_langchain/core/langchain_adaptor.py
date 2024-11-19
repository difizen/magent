from email import message
from typing import Any, AsyncIterator, List, Sequence
from langchain_community.callbacks.manager import get_openai_callback
from langchain_core.runnables import Runnable
from langchain_core.messages import HumanMessage, AIMessage, AIMessageChunk, BaseMessage, BaseMessageChunk
from langchain_core.agents import AgentAction, AgentStep, AgentFinish
from langchain_core.runnables.utils import AddableDict
from numpy import isin
from .base_adaptor import InputAdaptor, StreamInvokeAdaptor
from .event import BaseEvent, BaseOutputMessage, ChunkEvent, ResultEvent


def merge_strings(input_list):
    """
    Merge all string elements in the input list into a single string.

    Args:
        input_list (list): A list potentially containing strings and other types.

    Returns:
        str: A single string containing all the merged string elements.
    """
    # Create a list to hold string elements
    string_elements = []

    # Iterate through each element in the input list
    for element in input_list:
        # Check if the element is a string
        if isinstance(element, str):
            # If it's a string, add it to the list of string elements
            string_elements.append(element)

    # Join all the string elements into a single string
    # Using space as a separator, you can adjust this as needed
    merged_string = ''.join(string_elements)

    return merged_string


class RunnableAdaptor(StreamInvokeAdaptor, InputAdaptor):
    @staticmethod
    def recognizer(object, llm_type: str | None = None):
        return isinstance(object, Runnable)

    def to_input_message(self, value, image=None):
        message = HumanMessage(content=value)
        return [message]

    def get_input_adaptor(self) -> InputAdaptor:
        if self.input_adaptor is not None:
            return self.input_adaptor
        return self

    def invoke(self, value, image=None) -> BaseOutputMessage | None:
        if not isinstance(self.object, Runnable):
            return None
        messages = self.get_input_adaptor().to_input_message(value, image)
        message = self.object.invoke(messages)
        data_list = []
        id = ''
        if isinstance(message, AIMessage):
            if message.id is not None:
                id = message.id
            if isinstance(message.content, str):
                data_list.append(message.content)
            if isinstance(message.content, list):
                data_list.append(merge_strings(message.content))
            else:
                print("Can not handle message content", message)
        data = data_list.pop()
        return BaseOutputMessage(id=id, output=data)

    def aimessages_to_event_data(self, messages: Sequence[BaseMessage | BaseMessageChunk]) -> List[str]:
        data_list = []
        for message in messages:
            if isinstance(message, AIMessage) or isinstance(message, AIMessageChunk):
                if isinstance(message.content, str):
                    data_list.append(message.content)
                if isinstance(message.content, list):
                    data_list.append(merge_strings(message.content))
                else:
                    print("Can not handle message content", message)
        return data_list

    def steps_to_event_data(self, steps: Sequence[AgentStep]) -> List[str]:
        data_list = []
        for step in steps:
            if isinstance(step.action, AgentAction) and step.observation is not None:
                data_list.append(f"\n{step.observation}\n")
        return data_list

    async def to_output_event(self, value: AsyncIterator, *args, **kwargs) -> AsyncIterator[BaseEvent]:
        first = True
        gathered = None
        id = ''
        async for msg_chunk in value:
            # id = msg_chunk.id
            # print('------ chunk', msg_chunk)
            # print('------ chunk type', type(msg_chunk))
            if first:
                gathered = msg_chunk
                first = False
            else:
                gathered = gathered + msg_chunk
            data_list = []
            if isinstance(msg_chunk, BaseMessageChunk) and len(msg_chunk.content) > 0:
                data_list = self.aimessages_to_event_data([msg_chunk])
            if isinstance(msg_chunk, AddableDict):
                messages = msg_chunk.get('messages', [])
                data_list = self.aimessages_to_event_data(messages)
                step_list = self.steps_to_event_data(
                    msg_chunk.get('steps', []))
                data_list.extend(step_list)

            if isinstance(msg_chunk, AgentAction) or isinstance(msg_chunk, AgentFinish) or isinstance(msg_chunk, AgentStep):
                data_list = self.aimessages_to_event_data(msg_chunk.messages)
            for data in data_list:
                yield ChunkEvent(id=id, data=BaseOutputMessage(id=id, output=data))

        # print('------ gathered', gathered)
        # print('------ gathered type', type(gathered))

        if isinstance(gathered, BaseMessageChunk) and len(gathered.content) > 0:
            data_list = self.aimessages_to_event_data([gathered])
            yield ResultEvent(id=id, data=BaseOutputMessage(id=id, output=data_list.pop()))

        if isinstance(gathered, AddableDict):
            yield ResultEvent(id=id, data=BaseOutputMessage(id=id, output=gathered.get('output', '')))

    def invoke_stream(self, value, image=None) -> AsyncIterator[BaseEvent] | None:
        if not isinstance(self.object, Runnable):
            return None
        messages = self.get_input_adaptor().to_input_message(value, image)
        stream_result = self.object.astream(messages)
        output_event = self.to_output_event(stream_result)
        return output_event
