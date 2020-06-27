# Stage 0 - Build frontend, "build-stage", based on Node.js, to build and compile the frontend
FROM tiangolo/node-frontend:10 as build-stage

ARG API_URL

WORKDIR /app

COPY frontend/package*.json /app/

ENV REACT_APP_API_URL ${API_URL}

RUN npm install

COPY frontend/ /app/

RUN npm run build


FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7
# For development, Jupyter remote kernel, Hydrogen
# Using inside the container:
# jupyter lab --ip=0.0.0.0 --allow-root --NotebookApp.custom_display_url=http://127.0.0.1:8888
ARG env=prod
#RUN bash -c "if [ $env == 'dev' ] ; then pip install jupyterlab ; fi"
#EXPOSE 8888

COPY --from=build-stage /app/build/ /static

COPY ./backend/app /app
WORKDIR /app
RUN pip install -U pip pipenv
RUN pipenv lock --requirements > requirements.txt
RUN pip install -r requirements.txt

ENV PYTHONPATH /app

EXPOSE 80
