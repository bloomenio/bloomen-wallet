#build
docker build --tag bloomenio/bloomen-wallet-cli:1.0.1 .
docker push bloomenio/bloomen-wallet-cli:1.0.1
#run
docker run  -it -v $(pwd)/.env:/usr/src/bloomen-wallet-cli/.env  -v $(pwd)/data:/usr/src/bloomen-wallet-cli/data bloomenio/bloomen-wallet-cli:1.0.1