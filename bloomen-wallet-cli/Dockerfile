# Docker image base
FROM ubuntu:18.04

# Docker container name and version
LABEL Name=bloomen-wallet-cli Version=1.1.0

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_8.x  | bash -
RUN apt-get -y install nodejs git make python make gcc g++ pkg-config

# Create work directory
WORKDIR /usr/src/bloomen-wallet-cli

# Copy app source to docker directory
COPY . /usr/src/bloomen-wallet-cli

# Install node dependencies
RUN npm install

# Run the client
CMD npm run start
