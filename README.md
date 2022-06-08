# Introduction

This is a web-based recreation of an old DOS game Hexxagon intended for two-player sessions. It was made for testing different web protocols (HTTP, MQTT, SSE).

# Installation

## configuration

In the `.env` file inside frontend directory, change `localhost` to your machine's IP address. It allows others to connect to the backend. Then proceed with one of the setups below.

## using Docker

If you have docker installed on your system, just run `docker-compose up -d` after inspecting the `.yml` file.

Note: it may be neccessary to disable firewall in order to provide access to local Docker network for LAN users. Either disable it entirely or make an exception for Docker (https://mlhale.github.io/nebraska-gencyber-modules/intro_to_firewalls/advanced/ for Windows users).

## manually

This requires Node.js >= 16.0.0.

### frontend

Run 

```sh
npm i --force
npm start
``` 

### backend

Run 

```sh
npm i
npm start
```

# Todo

- more MQTT events (lobby lacks some)
- migrate to newer packages
- resurrect this project
- ???