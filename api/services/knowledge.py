import logging
from typing import List, Optional
from models.knowledge_config import DocumentConfigModel, ImageConfigModel, KnowledgeConfigCreate, KnowledgeConfigModel, SheetConfigModel
from sqlalchemy.orm import Session

from dao.knowledge import KnowledgeConfigHelper, KnowledgeHelper
from models.knowledge import KnowledgeCreate, KnowledgeModel, KnowledgeType, KnowledgeUpdate


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
    def update(operator: int, knowledge_model: KnowledgeUpdate, session: Session) -> int:
        res = KnowledgeHelper.update(
            operator=operator, knowledge_model=knowledge_model, session=session)
        return res

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


class KnowledgeConfigService:
    @staticmethod
    def get_by_knowledge_id(operator: int, knowledge_id: int, session: Session) -> KnowledgeConfigModel | None:
        knowledge_orm = KnowledgeHelper.get(
            session=session, operator=operator, knowledge_id=knowledge_id)
        knowledge_model = KnowledgeModel.model_validate(knowledge_orm)
        config_type = knowledge_model.type

        knowledge_config_orm = KnowledgeConfigHelper.get_by_knowledge_id(
            session=session, operator=operator, knowledge_id=knowledge_id)
        knowledge_config_model: Optional[KnowledgeConfigModel] = None

        if config_type == KnowledgeType.DOCUMENT:
            knowledge_config_model = DocumentConfigModel.model_validate(
                knowledge_config_orm)
        elif config_type == KnowledgeType.SHEET:
            knowledge_config_model = SheetConfigModel.model_validate(
                knowledge_config_orm)
        elif config_type == KnowledgeType.IMAGE:
            knowledge_config_model = ImageConfigModel.model_validate(
                knowledge_config_orm)
        else:
            raise ValueError("Unsupported knowledge type")

        return knowledge_config_model

    @staticmethod
    def create(operator: int, knowledge_config: KnowledgeConfigCreate, session: Session):
        # 检查 knowledge_id 是否存在
        knowledge_id = knowledge_config.knowledge_id
        knowledge_orm = KnowledgeHelper.get(
            operator=operator, knowledge_id=knowledge_id, session=session)
        if not knowledge_orm:
            raise ValueError("Knowledge item not found")

        # 检查是否已经存在关联的 config
        existing_config = KnowledgeConfigHelper.get_by_knowledge_id(
            operator=operator, knowledge_id=knowledge_id, session=session)
        if existing_config:
            raise ValueError("Knowledge item already has an associated config")

        knowledge_config_orm = KnowledgeConfigHelper.create(
            operator=operator, knowledge_config_model=knowledge_config, session=session)

        if knowledge_config.config_type == KnowledgeType.DOCUMENT:
            knowledge_config_model = DocumentConfigModel.model_validate(
                knowledge_config_orm)
        elif knowledge_config.config_type == KnowledgeType.SHEET:
            knowledge_config_model = SheetConfigModel.model_validate(
                knowledge_config_orm)
        elif knowledge_config.config_type == KnowledgeType.IMAGE:
            knowledge_config_model = ImageConfigModel.model_validate(
                knowledge_config_orm)
        else:
            raise ValueError("Unsupported knowledge type")

        return knowledge_config_model

    @staticmethod
    def delete(operator: int, knowledge_config_id: int, session: Session) -> bool:
        if not KnowledgeConfigHelper.get(
                session=session, operator=operator, knowledge_config_id=knowledge_config_id):
            logging.warning(
                f"Attempt to delete non-existent knowledge with ID {knowledge_config_id}")
            return False  # No knowledge found with the given ID

        is_delete = KnowledgeConfigHelper.delete(
            session=session, operator=operator, knowledge_config_id=knowledge_config_id)
        session.commit()
        return is_delete
