# syntax=docker/dockerfile:1

# Create a first stage container to build the application, this container image will be dropped once
# the runner is built
FROM trion/ng-cli:12.2.1 as deps

# This Dockerfile uses labels from the label-schema namespace from http://label-schema.org/rc1/
LABEL maintainer="clara.schuster@tuwien.ac.at" \
        org.label-schema.name="DAMAP-frontend" \
        org.label-schema.description="DAMAP is a tool that aims to facilitate the creation of data management plans (DMPs) for researchers." \
        org.label-schema.usage="https://github.com/tuwien-csd/damap-frontend/tree/master/README.md" \
        org.label-schema.vendor="Technische Universität Wien" \
        org.label-schema.url="https://github.com/tuwien-csd/damap-frontend" \
        org.label-schema.vcs-url="https://github.com/tuwien-csd/damap-frontend" \
        org.label-schema.schema-version="1.0" \
        org.label-schema.docker.cmd="docker run -d -p 8080:8080 damap"

COPY package.json package-lock.json /app/

COPY . /app

# angular-cli is installed locally, thus we point PATH to its binary folder
ENV PATH="$PATH:/app/node_modules/@angular/cli/bin/"

# install and build the application on the builder container
RUN npm install && ng build

ARG APP=damap-frontend

# create a second container running a webserver and holding the built frontend application
FROM nginxinc/nginx-unprivileged as runner

COPY --from=deps --chown=1001:0 /app/dist/damap-frontend/ /usr/share/nginx/html/

# ---- TODO: Check if adaptions have to be made ---- 

# ---- TUG file content

# ### STAGE 1: Build ###
# FROM node:14.0.0 AS build

# # Keycloak
# ENV DAMAP_KEYCLOAK_PROD=/auth
# ENV DAMAP_REALM_PROD=tugraz
# ENV DAMAP_CLIENT_ID_PROD=dmap-test_tugraz_at

# # backend url
# ENV DAMAP_PROD=/api

# WORKDIR /usr/src/app
# COPY package.json package-lock.json ./

# # package-lock.json file isn't used at all when the --no-package-lock is on.
# RUN npm install --no-package-lock

# COPY . .

# # ng build --configuration=production
# RUN npm run build-prod
# >>>>>>> tug-gitlab/master
