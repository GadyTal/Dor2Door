"""empty message

Revision ID: c5c88c9e5ce5
Revises: f3fd2cf6022b
Create Date: 2020-04-10 20:45:36.684389

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c5c88c9e5ce5'
down_revision = 'f3fd2cf6022b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('volunteers', sa.Column('last_whatsapp_mission_at', sa.DateTime(), nullable=True))
    op.add_column('volunteers', sa.Column('last_whatsapp_welcome_at', sa.DateTime(), nullable=True))
    op.drop_column('volunteers', 'last_whatsapp_welcome')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('volunteers', sa.Column('last_whatsapp_welcome', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.drop_column('volunteers', 'last_whatsapp_welcome_at')
    op.drop_column('volunteers', 'last_whatsapp_mission_at')
    # ### end Alembic commands ###