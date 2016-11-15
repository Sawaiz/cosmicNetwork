# Dockerfile to build iot webserver
# Based on debian with nginx installed

# Set the base image to jessie
FROM resin/rpi-raspbian:jessie

# File Author / Maintainer
MAINTAINER asyed5@gsu.edu

#Update
RUN apt-get update && apt-get install -y nginx

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

VOLUME ["/usr/share/nginx/html"]
VOLUME ["/etc/nginx"]

# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf

# Copy a configuration file from the current directory
ADD nginx.conf /etc/nginx/

WORKDIR /usr/share/nginx/html

# Expose the default ports
EXPOSE 80 443

# Start nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
