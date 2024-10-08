

from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Any

from models.knowledge import KnowledgeCreate, KnowledgeORM, KnowledgeUpdate
import logging

from models.knowledge_config import DocumentConfigCreate, ImageConfigCreate, KnowledgeConfigORM, SheetConfigCreate


class KnowledgeHelper:
    @staticmethod
    def get(operator: int, knowledge_id: int, session: Session) -> KnowledgeORM | None:
        """
        获取一个知识库。
        """
        try:
            return session.query(KnowledgeORM).options(joinedload(KnowledgeORM.config)).filter_by(id=knowledge_id).one_or_none()
        except SQLAlchemyError as e:
            # 这里可以记录日志，例如使用 logging 模块记录错误详情
            logging.error(
                f"Failed to fetch the knowledge item: {e}")
            # 进一步你可以选择抛出自定义异常或者返回None
            raise

    @staticmethod
    def get_all_knowledges(operator: int, session: Session) -> List[KnowledgeORM]:
        """
        获取所有知识库
        """
        try:
            return session.query(KnowledgeORM).order_by(KnowledgeORM.updated_at.desc()).all()
        except SQLAlchemyError as e:
            logging.error(f"Failed to fetch all knowledges: {e}")
            raise

    @staticmethod
    def get_user_knowledges(operator: int, session: Session) -> List[KnowledgeORM]:
        """
        获取用户所有知识库
        """
        try:
            return session.query(KnowledgeORM).filter_by(created_by=operator).order_by(KnowledgeORM.updated_at.desc()).all()
        except SQLAlchemyError as e:
            logging.error(f"Failed to fetch user's knowledges: {e}")
            raise

    @staticmethod
    def create(operator: int, knowledge_model: KnowledgeCreate, session: Session) -> KnowledgeORM:
        try:
            now = datetime.now()
            model = KnowledgeORM(**{
                **knowledge_model.model_dump(),
                "created_by": operator,
                "created_at": now,
                "updated_by": operator,
                "updated_at": now
            })
            session.add(model)
            session.commit()
            session.refresh(model)
            return model
        except SQLAlchemyError as e:
            logging.error(f"Failed to create knowledge: {e}")
            session.rollback()
            raise  # Re-raise the exception after logging and rolling back

    @staticmethod
    def update(operator: int, knowledge_model: KnowledgeUpdate, session: Session) -> int:
        try:
            knowledge_id = knowledge_model.id
            now = datetime.now()
            update_model: Any = {
                **knowledge_model.model_dump(exclude_unset=True, exclude={"id"}),
                "updated_by": operator,
                "updated_at": now,
            }
            result = session.query(KnowledgeORM).filter_by(
                id=knowledge_id).update(update_model)
            session.commit()
            return result
        except SQLAlchemyError as e:
            logging.error(f"Failed to update knowledge: {e}")
            session.rollback()
            raise  # Re-raise the exception after logging and rolling back

    @staticmethod
    def delete(operator: int, knowledge_id: int, session: Session) -> bool:
        try:
            # 使用 get 方法来查找知识项
            knowledge_item = KnowledgeHelper.get(
                operator, knowledge_id, session)
            if knowledge_item:
                session.delete(knowledge_item)
                session.commit()
                return True
            else:
                return False
        except SQLAlchemyError as e:
            logging.error(f"Failed to delete knowledge: {e}")
            session.rollback()
            return False


class KnowledgeConfigHelper:
    @staticmethod
    def get(operator: int, knowledge_config_id: int, session: Session) -> KnowledgeConfigORM | None:
        """
        获取一个知识库。
        """
        try:
            return session.query(KnowledgeConfigORM).filter_by(id=knowledge_config_id).one_or_none()
        except SQLAlchemyError as e:
            # 这里可以记录日志，例如使用 logging 模块记录错误详情
            logging.error(
                f"Failed to fetch the knowledge config item: {e}")
            # 进一步你可以选择抛出自定义异常或者返回None
            raise

    @staticmethod
    def get_by_knowledge_id(operator: int, knowledge_id: int, session: Session) -> KnowledgeConfigORM | None:
        """
        获取一个知识库。
        """
        try:
            return session.query(KnowledgeConfigORM).filter_by(knowledge_id=knowledge_id).one_or_none()
        except SQLAlchemyError as e:
            # 这里可以记录日志，例如使用 logging 模块记录错误详情
            logging.error(
                f"Failed to fetch the knowledge config item: {e}")
            # 进一步你可以选择抛出自定义异常或者返回None
            raise

    @staticmethod
    def create(operator: int, knowledge_config_model: DocumentConfigCreate | SheetConfigCreate | ImageConfigCreate, session: Session):
        try:
            now = datetime.now()
            # 将模型实例转换为字典
            knowledge_config_data = knowledge_config_model.model_dump()
            # 提取需要的字段
            knowledge_id = knowledge_config_data.pop("knowledge_id")
            config = knowledge_config_data.pop("config")
            config_type = knowledge_config_data.pop("config_type")

            document_config = KnowledgeConfigORM(**{
                "created_by": operator,
                "created_at": now,
                "updated_by": operator,
                "updated_at": now,
                "knowledge_id": knowledge_id,
                "config": config,
                "config_type": config_type
            })
            session.add(document_config)
            session.commit()
            session.refresh(document_config)
            return document_config
        except SQLAlchemyError as e:
            logging.error(f"Failed to create knowledge config: {e}")
            session.rollback()
            raise  # Re-raise the exception after logging and rolling back

    @staticmethod
    def delete(operator: int, knowledge_config_id: int, session: Session) -> bool:
        try:
            # 使用 get 方法来查找知识 config
            knowledge_item = KnowledgeConfigHelper.get(
                operator, knowledge_config_id, session)
            if knowledge_item:
                session.delete(knowledge_item)
                session.commit()
                return True
            else:
                return False
        except SQLAlchemyError as e:
            logging.error(f"Failed to delete knowledge: {e}")
            session.rollback()
            return False
