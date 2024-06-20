"""add conversation created by

Revision ID: 9db9c74ab460
Revises: fde732bae2fb
Create Date: 2024-06-20 15:58:20.219548

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9db9c74ab460'
down_revision: Union[str, None] = 'fde732bae2fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('conversations', sa.Column('created_by', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('conversations', 'created_by')
    # ### end Alembic commands ###
