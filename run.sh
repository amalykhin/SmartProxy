sudo docker-compose up -d --scale mongo=3 --scale uservice=3 \
	&& sleep 10 \
	&& node proxy/server.js \
	&& sudo docker-compose stop
