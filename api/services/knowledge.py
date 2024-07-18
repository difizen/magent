import logging
from typing import List
from sqlalchemy.orm import Session

from dao.knowledge import KnowledgeHelper
from models.knowledge import KnowledgeCreate, KnowledgeModel


class KnowledgeService:
    @staticmethod
    def get(operator: int, knowledge_id: int, session: Session) -> KnowledgeModel | None:
        knowledge_orm = KnowledgeHelper.get(
            session=session, operator=operator, knowledge_id=knowledge_id)
        if knowledge_orm is None:
            return None
        else:
            return KnowledgeModel.model_validate(knowledge_orm)

    @staticmethod
    def get_all_knowledges(operator: int, session: Session) -> List[KnowledgeModel]:
        knowledge_orms = KnowledgeHelper.get_all_knowledges(
            operator=operator, session=session)
        return [KnowledgeModel.model_validate(knowledge_orm) for knowledge_orm in knowledge_orms]

    @staticmethod
    def get_user_knowledges(operator: int, session: Session) -> List[KnowledgeModel]:
        knowledge_orms = KnowledgeHelper.get_user_knowledges(
            operator=operator, session=session)
        return [KnowledgeModel.model_validate(knowledge_orm) for knowledge_orm in knowledge_orms]

    @staticmethod
    def create(operator: int, knowledge_model: KnowledgeCreate, session: Session) -> KnowledgeModel:
        knowledge_orm = KnowledgeHelper.create(
            session=session, operator=operator, knowledge_model=knowledge_model)
        return KnowledgeModel.model_validate(knowledge_orm)

    @staticmethod
    def delete(operator: int, knowledge_id: int, session: Session) -> bool:
        if not KnowledgeHelper.get(
                session=session, operator=operator, knowledge_id=knowledge_id):
            logging.warning(
                f"Attempt to delete non-existent knowledge with ID {knowledge_id}")
            return False  # No knowledge found with the given ID

        is_delete = KnowledgeHelper.delete(
            session=session, operator=operator, knowledge_id=knowledge_id)
        session.commit()
        return is_delete
