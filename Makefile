up:
	docker-compose up -d

down:
	docker-compose down

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

build:
	docker-compose build

force-build:
	docker-compose build --force-rm