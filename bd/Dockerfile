# syntax=docker/dockerfile:1

FROM mysql:8.4

ENV MYSQL_ROOT_PASSWORD_FILE="/run/secrets/root-password.txt"
ENV MYSQL_USER_FILE="/run/secrets/user.txt"
ENV MYSQL_PASSWORD_FILE="/run/secrets/password.txt"

WORKDIR /docker-entrypoint-initdb.d

COPY sql/dbo/dbo_schema.sql .
COPY config/grant_all.sh .

WORKDIR /etc/mysql/conf.d

COPY config/config-file.cnf .

