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
sudo apt-get install nodejs
sudo apt-get install npm

echo "Linking 'nodejs' to 'node'"
echo "=========================="
sudo ln -s /usr/bin/nodejs /usr/bin/node

echo "Installing global node dependencies"
echo "==================================="
npm install -g bower
npm install -g forever
npm install -g grunt-cli karma

echo "Setting up postgres"
echo "==================="
sudo -u postgres psql javelin -c "ALTER ROLE postgres WITH PASSWORD 'postmaster'; CREATE DATABASE javelin;"

echo "Setting up Javelin"
echo "=================="
cd /home/ubuntu/javelin-node
npm install
cd /home/ubuntu/javelin-node/static
bower install
cd /home/ubuntu/javelin-node/static/bower_components/angular-ui-bootstrap
npm install
grunt build
cd /home/ubuntu/javelin-node
grunt
sudo forever start app.js

echo "Setting up nginx"
echo "================"
echo "What is the subdomain?"

read subdomain

sudo cat /root/keys/javelinwebapp.com.crt /root/keys/gd_bundle-g2-g1.crt >> /etc/nginx/ssl/javelinwebapp.com.chained.crt
sudo cp /root/keys/javelinwebapp.com.crt /etc/nginx/ssl/javelinwebapp.com.crt
sudo cp /root/keys/javelinwebapp.com.pem /etc/nginx/ssl/javelinwebapp.com.pem

echo "upstream nodejs {
        server 127.0.0.1:8080 max_fails=0;
}

server {
        listen 80;
        server_name $subdomain.javelinwebapp.com;
        return 301 https://$subdomain.javelinwebapp.com\$request_uri;
}

server {
        access_log /var/logs/$subdomain.javelinwebapp.com/ssl_access.log;
        error_log /var/logs/$subdomain.javelinwebapp.com/ssl_error.log;
        listen 443;
        server_name $subdomain.javelinwebapp.com;
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

sudo ln -s /etc/nginx/sites-available/javelin /etc/nginx/sites-enabled/javelin
rm /etc/nginx/sites-enabled/default

echo "Restarting nginx"
echo "================"
sudo nginx -c /etc/nginx/nginx.conf
sudo nginx -s reload

echo "DONE!"