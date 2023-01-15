#!/bin/bash

./target/debug/critica-service \
  --port=8080 \
  --database-url=postgres://postgres:toor@localhost/critica \
  --app-pub-origin=http://localhost:3000 \
  --auth-service-url=http://localhost:8079
