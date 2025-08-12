NAME=express
VERSION=1.0

.PHONY: init up down restart logs ssh-express ssh-mysql db-reset migrate seed test

init:
	# build and start containers
	docker compose build && docker compose up -d ; \
	# wait for mysql to be ready
	for i in $$(seq 1 60); do docker exec lh_react_mysql mysqladmin ping -h 127.0.0.1 -uroot -proot --silent && break || sleep 1; done ; \
	# apply migrations (no creation), generate client and seed
	docker compose exec express sh -lc "npx prisma migrate deploy && npx prisma generate" ; \
	docker compose exec express sh -lc "npx ts-node src/infrastructure/prisma/seed.ts || true" ; \
	# health check
	curl -s -o /dev/null -w "API http://localhost:18081/api/items -> HTTP %{http_code}\n" http://localhost:18081/api/items ; \
	# Prisma Studio の自動起動は任意運用に変更（必要時は `make studio` を使用）

up:
	docker compose up -d

down:
	docker compose down -v

restart:
	docker compose restart

logs:
	docker compose logs -f --tail=200

ssh-express:
	docker compose exec express sh

ssh-mysql:
	docker compose exec lh_react_mysql bash -c "mysql -u$${MYSQL_USER:-api_user} -p$${MYSQL_PASSWORD:-p@ssw0rd} -h 127.0.0.1 -P 3306"

db-reset:
	docker compose exec express bash -c "npx prisma migrate reset --force"

migrate:
	docker compose exec express bash -c "npx prisma migrate dev"

seed:
	docker compose exec express bash -c "ts-node src/infrastructure/prisma/seed.ts || node dist/infrastructure/prisma/seed.js || true"

test:
	docker compose exec express bash -c "npm test"

studio:
	docker compose exec -d express sh -lc "npx prisma studio --port 5555 --hostname 0.0.0.0"

studio-logs:
	docker compose logs -f express | sed -n '/Prisma Studio/s//&/p'

studio-stop:
	docker compose exec express sh -lc "pkill -f 'prisma studio' || true"
