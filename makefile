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

rmi:
	$(dc) down --rmi all
	@make up

rmv:
	$(dc) down -v
	@make up

ps:
	$(dc) ps

logs:
	$(dc) logs

logsf:
	$(dc) logs -f

mysql:
	docker compose exec -it e-ten-db bash -c "mysql -u root -p e-ten"  
