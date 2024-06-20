from typing import List, Dict
from pydantic import BaseModel
from langchain.schema.messages import BaseMessage
from .message import ConversationMessage


class ConversationRecord(BaseModel):
    messages = []

    def get_messages(self) -> List[BaseMessage]:
        return self.messages

    def append_messages(
        self,
        messages: List[ConversationMessage],
    ):

        for m in messages:
            self.append_message(m)

    def append_message(
        self,
        msg: ConversationMessage
    ):
        self.messages.append(msg)


class ConversationRecordProvide(BaseModel):
    record_dict: Dict[str, ConversationRecord] = {}

    def get_record(self, record_id: str) -> ConversationRecord:
        if record_id not in self.record_dict:
            self.record_dict[record_id] = ConversationRecord()
        return self.record_dict[record_id]

    def get_records(self) -> List[str]:
        return list(self.record_dict.keys())
