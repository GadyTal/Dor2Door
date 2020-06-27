"""Delete unique in schedule_task endpoint

Revision ID: 71b952f10bf8
Revises: 227395345c6b
Create Date: 2020-04-25 10:14:07.278635

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '71b952f10bf8'
down_revision = '227395345c6b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_scheduled_tasks_endpoint', table_name='scheduled_tasks')
    op.drop_index('ix_scheduled_tasks_failure_description', table_name='scheduled_tasks')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('ix_scheduled_tasks_failure_description', 'scheduled_tasks', ['failure_description'], unique=False)
    op.create_index('ix_scheduled_tasks_endpoint', 'scheduled_tasks', ['endpoint'], unique=True)
    # ### end Alembic commands ###