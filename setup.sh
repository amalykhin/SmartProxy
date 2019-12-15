sudo docker-compose up --build --scale mongo=3 --scale uservice=0 -d \
	&& sleep 20 \
	&& sudo docker exec -it smartproxy_mongo_1 /bin/bash -c 'mongo --eval "rs.initiate({\"_id\":\"rs0\",\"members\":[{\"_id\":0,\"host\":\"smartproxy_mongo_1:27017\"},{\"_id\":1,\"host\":\"smartproxy_mongo_2:27017\"},{\"_id\":2,\"host\":\"smartproxy_mongo_3:27017\"}]})"' \
	&& sudo docker-compose stop
