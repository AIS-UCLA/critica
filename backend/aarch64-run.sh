#!/bin/sh

./aarch64/critica-service \
  --port=8080 \
  --database-url=postgres://ubuntu:toor@localhost/critica \
  --site-external-url=http://critica.eaucla.org \
  --auth-service-url=http://localhost:8079
