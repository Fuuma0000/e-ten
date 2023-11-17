FROM mysql:8.0

ADD ./my.cnf /etc/mysql/conf.d/my.cnf

CMD [ "mysqld", "--innodb_use_native_aio=0" ]
