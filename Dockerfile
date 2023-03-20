FROM node:16

RUN mkdir -p /exmste

WORKDIR /exmste

# Create app directory
# RUN npm install
# RUN npm run build 


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./
# COPY tsconfig.json ./
COPY ./build ./build
COPY .env .env
COPY package*.json .
COPY node_modules ./node_modules
#COPY .exmwall.key .exmwall.key
#COPY .exmwall.soc.url .exmwall.soc.url
#COPY .exmwall.url .exmwall.url
#COPY public_key.pem public_key.pem
#COPY private_key.pem private_key.pem




# RUN rm -rf node_modules

# RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
# COPY . .

# RUN npm run build 

# COPY . .

# COPY .env ./build

# WORKDIR ./build/ 

EXPOSE 4600
CMD ["node", "./build/index.js"]

# FROM node:16
# WORKDIR /usr
# COPY package.json ./
# COPY tsconfig.json ./
# COPY src ./src
# RUN ls -a
# RUN npm install
# EXPOSE 4500
# CMD ["npm","run","dev"]