.PHONY: reset

reset:
	docker-compose down -v
	docker-compose up -d
