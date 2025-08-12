NAME=name
VERSION=1.0

init:
	docker compose build && \
	docker compose up -d && \
	docker compose exec lh_react_server bash -c "systemctl start nginx && systemctl enable nginx" && \
	docker compose exec lh_react_php bash -c "composer install && cp .env.local .env && php artisan migrate:fresh --seed && php artisan storage:link"

start:
	docker compose start  && \
    docker compose exec lh_react_server bash -c "systemctl start nginx && systemctl enable nginx"

up:
	docker compose up -d && \
    docker compose exec lh_react_server bash -c "systemctl start nginx && systemctl enable nginx"

nginx-start:
	docker compose exec lh_react_server bash -c "systemctl start nginx && systemctl enable nginx && systemctl status nginx"

db-fresh:
	docker compose exec lh_react_php bash -c "php artisan migrate:fresh --seed"

ssh-php:
	docker compose exec lh_react_php bash

ssh-mysql:
	docker compose exec lh_react_mysql bash -c "mysql -u user -p"

ssh-server:
	docker compose exec lh_react_server bash
