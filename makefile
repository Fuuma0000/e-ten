dc := docker-compose -f ./docker-compose.yml

up:
	$(dc) up -d

down:
	$(dc) down

restart:
	$(dc) restart

reup:
	@make down
	@make up

rm:
	$(dc) down --rmi all

ps:
	$(dc) ps

logs:
	$(dc) logs

logsf:
	$(dc) logs -f

reset:
	@make rm
	@make up

mysql:
	docker exec -it e-ten-db bash -c "mysql -u root -p e-ten"  
