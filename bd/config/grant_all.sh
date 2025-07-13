#! /bin/bash

mysql -u'root' -p$MYSQL_ROOT_PASSWORD -e "GRANT ALL ON *.* TO '$MYSQL_USER'@'%' WITH GRANT OPTION;" \
    && echo "[GRANT SCRIPT] Permissões concedidas ao usuário!" \
    || echo "[GRANT SCRIPT] Falha ao conceder permissão a todas as tabelas..."
