# Stage 0 - Build frontend, "build-stage", based on Node.js, to build and compile the frontend
FROM tiangolo/node-frontend:10 as build-stage

WORKDIR /app

COPY frontend/package*.json /app/

RUN npm install

COPY frontend/ /app/

RUN npm run build



FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7
# For development, Jupyter remote kernel, Hydrogen
# Using inside the container:
# jupyter lab --ip=0.0.0.0 --allow-root --NotebookApp.custom_display_url=http://127.0.0.1:8888
ARG env=dev
#RUN bash -c "if [ $env == 'dev' ] ; then pip install jupyterlab ; fi"
#EXPOSE 8888

ENV POSTGRES_SERVER db
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD *****
ENV POSTGRES_DB door2dor
ENV PROJECT_NAME Door2Dor
ENV SECRET_KEY *******************************
ENV SERVER_HOST http://localhost
ENV SERVER_NAME door2dor
ENV ENV dev

COPY --from=build-stage /app/build/ /static

COPY ./backend/app /app
WORKDIR /app
RUN apt update -y
RUN pip install -U pip pipenv ipython
RUN apt install -y ipython3
RUN pipenv lock --requirements > requirements.txt
RUN pip install -r requirements.txt

ENV PYTHONPATH /app

EXPOSE 80
