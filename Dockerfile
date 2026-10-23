# Node.js version must match .nvmrc (npm run check:node verifies it).
ARG NODE_VERSION=24.22.1

FROM node:${NODE_VERSION}-trixie-slim@sha256:43b9ba1142b8dcf33fa8f922ca1be85714adc444e0586c7cf7726daaeabc1bea AS deps
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package.json package-lock.json .npmrc ./
RUN npm ci --no-fund --no-audit

FROM deps AS check
COPY --chown=node:node . .
CMD ["npm", "run", "verify"]

FROM deps AS build
COPY --chown=node:node . .
RUN npm run build:github-pages && node scripts/check-dist.mjs

FROM build AS preview
EXPOSE 4173
CMD ["npm", "run", "preview:github-pages"]
