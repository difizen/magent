"""empty message

Revision ID: 5daae45cc6b5
Revises: f54e1fc0bd90
Create Date: 2024-07-22 07:06:57.366519

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5daae45cc6b5'
down_revision: Union[str, None] = 'f54e1fc0bd90'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('knowledge_image_config')
    op.drop_table('knowledge_document_config')
    op.drop_table('knowledge_sheet_config')
    op.add_column('knowledge_config', sa.Column(
        'config', sa.JSON(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('messages', 'message_type',
                    existing_type=sa.Enum(
                        'MARKDOWN', 'TEXT', name='messagetype'),
                    type_=sa.VARCHAR(length=50),
                    existing_nullable=False)
    op.drop_column('knowledge_config', 'config')
    op.create_table('knowledge_sheet_config',
                    sa.Column('id', sa.INTEGER(),
                              autoincrement=False, nullable=False),
                    sa.Column('headers', sa.TEXT(),
                              autoincrement=False, nullable=True),
                    sa.Column('structure', sa.TEXT(),
                              autoincrement=False, nullable=True),
                    sa.ForeignKeyConstraint(
                        ['id'], ['knowledge_config.id'], name='knowledge_sheet_config_id_fkey'),
                    sa.PrimaryKeyConstraint(
                        'id', name='knowledge_sheet_config_pkey')
                    )
    op.create_table('knowledge_document_config',
                    sa.Column('id', sa.INTEGER(),
                              autoincrement=False, nullable=False),
                    sa.Column('mode', postgresql.ENUM(
                        'AUTO', 'CUSTOM', name='splittype'), autoincrement=False, nullable=True),
                    sa.Column('chunk_size', sa.VARCHAR(length=255),
                              autoincrement=False, nullable=True),
                    sa.Column('identifier', sa.VARCHAR(length=255),
                              autoincrement=False, nullable=True),
                    sa.Column('text_preprocessing_rules', postgresql.JSON(
                        astext_type=sa.Text()), autoincrement=False, nullable=True),
                    sa.ForeignKeyConstraint(
                        ['id'], ['knowledge_config.id'], name='knowledge_document_config_id_fkey'),
                    sa.PrimaryKeyConstraint(
                        'id', name='knowledge_document_config_pkey'),
                    sa.UniqueConstraint(
                        'chunk_size', name='knowledge_document_config_chunk_size_key')
                    )
    op.create_table('knowledge_image_config',
                    sa.Column('id', sa.INTEGER(),
                              autoincrement=False, nullable=False),
                    sa.Column('mode', sa.VARCHAR(),
                              autoincrement=False, nullable=True),
                    sa.Column('description', sa.TEXT(),
                              autoincrement=False, nullable=True),
                    sa.ForeignKeyConstraint(
                        ['id'], ['knowledge_config.id'], name='knowledge_image_config_id_fkey'),
                    sa.PrimaryKeyConstraint(
                        'id', name='knowledge_image_config_pkey')
                    )
    # ### end Alembic commands ###