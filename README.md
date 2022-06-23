# Hypercube on IPFS

The implementation of a Decentralized keywords Search Engine based on a hypercube structure and integrated with IPFS using Python.

<center><img src="sys_arch.png" width="75%" align="center"></center>

## Install with Docker

##### Requirements

- Docker
- Docker Compose -> [install](https://docs.docker.com/compose/install/)

##### Commands

```
git clone
cd hypfs/server
docker build -t hypercube .
cd ../client
docker build -t hypercube-client .
cd ..
docker-compose up -d
```

## Note
To run in "local mode" skip **usage** section and use:
   - `docker run -d --name ipfs_host -e IPFS_SWARM_KEY=<your swarm key> -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest`: this allow to start an **IPFS docker container** [Source](https://docs.ipfs.io/how-to/run-ipfs-inside-docker/#customizing-your-node)


## Usage

1. **Check status**
   `docker-compose logs -f` for all services
   `docker-compose logs -f hypercube_0` for an hypercube node
   `docker-compose logs -f ipfs
2. **Start client hash**
   `docker-compose run hypercube-client bash`
3. **Work with the client bash**
   `python menu.py /ip4/127.0.0.1/tcp/5001 1`

   - the first parameter is your IPFS node API address
   - the second parameter is the ID one Hypercube node (are configured to be from 1 to 8)

   `python`

   - to open a python console, then:
   - `from client import Client`
   - `client = Client('/ip4/127.0.0.1/tcp/5001',1)` (a warning will appear)
   - `client.add_obj('test.txt',3)` for adding an object, use only keywords from 0 to 7
   - `client.pin_search(3,-1)` to search using the keyword '3'
   - `client.get_obj('QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o')` will download an object from IPFS in the `objects` directory

## Folders

##### ./server

- contains the hypercube and node implementation
- _/hop_counter_ contains an app for counting network hops

##### ./client

- contains all the client for interacting with nodes
- _/results_: contains the results of tests carried out with the _bench.py_ script.
- _/demo_: contains a library for the interface of the _menu.py_ script.
- _/objects_: contains the objects downloaded from IPFS.

##### client executables

- _menu.py_: script that provides a user-friendly command line UI.
- _bench.py_: script used for testing.

## References

- Zichichi M., Serena L., Ferretti S., D'Angelo G., [Governing Decentralized Complex Queries Through a DAO](https://mirkozichichi.me/assets/papers/14governing.pdf), in Proc. of the Conference on Information Technology for Social Good (GoodIT). 9-11 September 2021
- Zichichi M., Serena L., Ferretti S., D'Angelo G., [Towards Decentralized Complex Queries over Distributed Ledgers: a Data Marketplace Use-case](https://mirkozichichi.me/assets/papers/12towards.pdf) , in Proc. of the 30th IEEE International Conference on Computer Communications and Networks (ICCCN). 3rd International Workshop on Social (Media) Sensing. 19-22 July 2021

## License

[Apache License 2.0](./LICENSE)
