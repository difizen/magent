"""refactor agent_configs

Revision ID: d20082bb8fe6
Revises: 8344684f32dd
Create Date: 2024-06-14 16:37:31.473864

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd20082bb8fe6'
down_revision: Union[str, None] = '8344684f32dd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('agent_bots', 'draft')
    op.add_column('agent_configs', sa.Column('bot_id', sa.Integer(), nullable=True))
    op.add_column('agent_configs', sa.Column('is_draft', sa.Boolean(), nullable=False))
    op.drop_column('agent_configs', 'status')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('agent_configs', sa.Column('status', postgresql.ENUM('DRAFT', 'PUBLISH', name='agentconfigstatus'), autoincrement=False, nullable=False))
    op.drop_column('agent_configs', 'is_draft')
    op.drop_column('agent_configs', 'bot_id')
    op.add_column('agent_bots', sa.Column('draft', sa.INTEGER(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###