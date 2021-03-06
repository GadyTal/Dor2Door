"""adding state on volunter_mission

Revision ID: febc57ad8930
Revises: a559679e6cab
Create Date: 2020-04-14 13:33:54.162359

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'febc57ad8930'
down_revision = 'a559679e6cab'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    enum = sa.Enum('pending', 'accepted', name='volunteermissionstate')
    enum.create(op.get_bind())
    op.add_column('volunteer_mission', sa.Column('state', enum, nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('volunteer_mission', 'state')
    enum = sa.Enum('pending', 'accepted', name='volunteermissionstate')
    enum.drop(op.get_bind())
    # ### end Alembic commands ###
