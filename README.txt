Prerequisites:
 - nginx correctly installed.
   # sudo apt-get install nginx

 - node correctly installed

Fast nginx configuration:

* Edit bucket.nginx.conf
 - In the line that reads "alias /path/to/BucketServer/client;" change "/path/to/BucketServer/client" to the absolute path of your <cloned BucketServer repo>/client
 - Comment server_name:
  # server_name bucket.tid.ovh;

* Add new configuration to nginx

 # sudo ln -s <cloned BucketServer repo>/bucket.nginx.conf /etc/nginx/sites-enabled/bucket

* if nginx is not already started
 # sudo nginx

* if nginx is already stared, restart it

 # sudo nginx -s reload

Start server:

 # cd <cloned BucketServer repo>
 # node server/server.js

How to run:

View the client http://yourIpAddress:8080/client
Send data http://yourIpAddress:8080/<anything>
