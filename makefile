.PHONY: recreate-volume

VOLUME_NAME=db-data

recreate-volume:
	docker-compose down -v
	@if docker volume inspect $(VOLUME_NAME) >/dev/null 2>&1; then \
		echo "Removing existing volume: $(VOLUME_NAME)"; \
		docker-compose down -v; \
		docker volume rm $(VOLUME_NAME); \
	fi
	docker-compose up -d
