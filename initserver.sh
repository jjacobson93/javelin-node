#!/bin/bash

echo "Updating apt-get"
echo "================"
sudo apt-get update

echo "Installing dependencies"
echo "======================="
sudo apt-get install nginx
sudo apt-get install mongodb
sudo apt-get install redis-tools
sudo apt-get install redis-server
sudo apt-get install postgresql
sudo apt-get install libpq-dev
sudo apt-get install nodejs
sudo apt-get install npm

echo "Linking 'nodejs' to 'node'"
echo "=========================="
sudo ln -s /usr/bin/nodejs /usr/bin/node

echo "Installing global node dependencies"
echo "==================================="
sudo npm install -g bower
sudo npm install -g forever
sudo npm install -g grunt-cli

echo "Setting up postgres"
echo "==================="
sudo -u postgres psql -c "ALTER ROLE postgres WITH PASSWORD 'postmaster';"
sudo -u postgres psql -c "CREATE DATABASE javelin;"

echo "Setting up Javelin"
echo "=================="
cd /home/ubuntu/javelin-node
npm install
cd /home/ubuntu/javelin-node/static
bower install
cd /home/ubuntu/javelin-node
grunt
forever start app.js

echo "Setting up nginx"
echo "================"
echo "What is the subdomain?"

read SUBDOMAIN

sudo su
mkdir /etc/nginx/ssl
touch /etc/nginx/ssl/javelinwebapp.com.chained.crt
cat /root/keys/javelinwebapp.com.crt /root/keys/gd_bundle-g2-g1.crt >> /etc/nginx/ssl/javelinwebapp.com.chained.crt
cp /root/keys/javelinwebapp.com.key /etc/nginx/ssl/javelinwebapp.com.key

echo "upstream nodejs {
        server 127.0.0.1:8080 max_fails=0;
}

server {
        listen 80;
        server_name $SUBDOMAIN.javelinwebapp.com;
        return 301 https://$SUBDOMAIN.javelinwebapp.com\$request_uri;
}

server {
        access_log /var/logs/$SUBDOMAIN.javelinwebapp.com/ssl_access.log;
        error_log /var/logs/$SUBDOMAIN.javelinwebapp.com/ssl_error.log;
        listen 443;
        server_name $SUBDOMAIN.javelinwebapp.com;
        ssl on;
        ssl_certificate ssl/javelinwebapp.com.chained.crt;
        ssl_certificate_key ssl/javelinwebapp.com.key;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_session_timeout 10m;
        ssl_session_cache shared:SSL:60m;

        location / {
                proxy_set_header Host \$host;
                proxy_pass_request_headers on;
                proxy_pass http://nodejs;
                proxy_set_header X-Real-IP \$remote_addr;
                proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto \$scheme;
        }
}" > /etc/nginx/sites-available/javelin

ln -s /etc/nginx/sites-available/javelin /etc/nginx/sites-enabled/javelin
rm /etc/nginx/sites-enabled/default
mkdir -p /var/logs/$SUBDOMAIN.javelinwebapp.com

echo "Restarting nginx"
echo "================"
nginx -s stop
nginx -c /etc/nginx/nginx.conf
nginx -s reload

exit

echo "DONE!"