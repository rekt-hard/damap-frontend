### STAGE 1: Build ###
FROM node:14.0.0 AS build

# Keycloak
ENV DAMAP_KEYCLOAK_PROD=/auth
ENV DAMAP_REALM_PROD=tugraz
ENV DAMAP_CLIENT_ID_PROD=dmap-test_tugraz_at

# backend url
ENV DAMAP_PROD=/api

WORKDIR /usr/src/app
COPY package.json package-lock.json ./

# package-lock.json file isn't used at all when the --no-package-lock is on.
RUN npm install --no-package-lock

COPY . .

# ng build --configuration=production
RUN npm run build-prod
