up:
	docker compose up -d $(filter-out $@,$(MAKECMDGOALS))
	docker compose logs -f $(filter-out $@,$(MAKECMDGOALS))

down:
	docker compose down $(filter-out $@,$(MAKECMDGOALS))

build:
	docker compose build $(filter-out $@,$(MAKECMDGOALS))

logs:
	docker compose logs -f $(filter-out $@,$(MAKECMDGOALS))

ps:
	docker compose ps

res restart:
	docker compose down $(filter-out $@,$(MAKECMDGOALS))
	docker compose up -d $(filter-out $@,$(MAKECMDGOALS))
	docker compose logs -f $(filter-out $@,$(MAKECMDGOALS))

bres build-restart:
	docker compose down $(filter-out $@,$(MAKECMDGOALS)) && docker compose up --build -d $(filter-out $@,$(MAKECMDGOALS))
	docker compose logs -f $(filter-out $@,$(MAKECMDGOALS))

