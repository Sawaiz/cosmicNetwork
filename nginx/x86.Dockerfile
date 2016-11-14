# Dockerfile to build iot webserver
# Based on debian with nginx installed

# Set the base image to nginx
FROM nginx

# File Author / Maintainer
MAINTAINER asyed5@gsu.edu

# Update
# RUN apt-get -y update && apt-get install -y \
# package \
# package

# # Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf

# # Copy a configuration file from the current directory
ADD nginx.conf /etc/nginx/

WORKDIR /usr/share/nginx/html

# Expose the default ports
EXPOSE 80 443

# Start nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
