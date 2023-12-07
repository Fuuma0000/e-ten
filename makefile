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
	$(dc) exec -it express bash -c "npm install" 
	$(dc) exec -it app bash -c "cd e-ten-front/ && npm install"

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
	$(dc) exec -it db bash -c "mysql -u root -p e-ten"  

inapp:
	$(dc) exec -it app bash

indb:
	$(dc) exec -it db bash

inex:
	$(dc) exec -it express bash

# appに入ってnpm installするコマンド
npmia:
	$(dc) exec -it app bash -c "cd e-ten-front/ && npm install"

npmie:
	$(dc) exec -it express bash -c "npm install"
