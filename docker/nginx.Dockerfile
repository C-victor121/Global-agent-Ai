FROM nginx:alpine

# Install certbot for Let's Encrypt and curl for testing
RUN apk add --no-cache certbot certbot-nginx openssl curl

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directories for SSL certificates
RUN mkdir -p /etc/ssl/certs /etc/ssl/private

# Create a script to generate self-signed certificates if Let's Encrypt fails
RUN echo '#!/bin/sh' > /generate-ssl.sh && \
    echo 'if [ ! -f /etc/ssl/certs/globalsolarco.shop.crt ]; then' >> /generate-ssl.sh && \
    echo '  echo "Generating self-signed certificate..."' >> /generate-ssl.sh && \
    echo '  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \' >> /generate-ssl.sh && \
    echo '    -keyout /etc/ssl/private/globalsolarco.shop.key \' >> /generate-ssl.sh && \
    echo '    -out /etc/ssl/certs/globalsolarco.shop.crt \' >> /generate-ssl.sh && \
    echo '    -subj "/C=US/ST=State/L=City/O=Organization/CN=globalsolarco.shop"' >> /generate-ssl.sh && \
    echo 'fi' >> /generate-ssl.sh && \
    chmod +x /generate-ssl.sh

# Create a script to obtain Let's Encrypt certificates
RUN echo '#!/bin/sh' > /letsencrypt.sh && \
    echo 'echo "Attempting to obtain Lets Encrypt certificate..."' >> /letsencrypt.sh && \
    echo 'echo "Testing domain accessibility..."' >> /letsencrypt.sh && \
    echo 'if ! curl -f http://globalsolarco.shop/.well-known/acme-challenge/test 2>/dev/null; then' >> /letsencrypt.sh && \
    echo '  echo "Warning: Domain may not be accessible for verification"' >> /letsencrypt.sh && \
    echo 'fi' >> /letsencrypt.sh && \
    echo 'certbot certonly --webroot -w /var/www/certbot \' >> /letsencrypt.sh && \
    echo '  -d globalsolarco.shop -d www.globalsolarco.shop \' >> /letsencrypt.sh && \
    echo '  --email admin@globalsolarco.shop --agree-tos --no-eff-email \' >> /letsencrypt.sh && \
    echo '  --non-interactive --verbose' >> /letsencrypt.sh && \
    echo 'CERTBOT_EXIT_CODE=$?' >> /letsencrypt.sh && \
    echo 'if [ $CERTBOT_EXIT_CODE -eq 0 ]; then' >> /letsencrypt.sh && \
    echo '  echo "Lets Encrypt certificate obtained successfully!"' >> /letsencrypt.sh && \
    echo '  ln -sf /etc/letsencrypt/live/globalsolarco.shop/fullchain.pem /etc/ssl/certs/globalsolarco.shop.crt' >> /letsencrypt.sh && \
    echo '  ln -sf /etc/letsencrypt/live/globalsolarco.shop/privkey.pem /etc/ssl/private/globalsolarco.shop.key' >> /letsencrypt.sh && \
    echo '  nginx -s reload' >> /letsencrypt.sh && \
    echo 'else' >> /letsencrypt.sh && \
    echo '  echo "Lets Encrypt failed with exit code: $CERTBOT_EXIT_CODE"' >> /letsencrypt.sh && \
    echo '  echo "Using self-signed certificate as fallback"' >> /letsencrypt.sh && \
    echo '  /generate-ssl.sh' >> /letsencrypt.sh && \
    echo 'fi' >> /letsencrypt.sh && \
    echo 'exit $CERTBOT_EXIT_CODE' >> /letsencrypt.sh && \
    chmod +x /letsencrypt.sh

# Create webroot directory for Let's Encrypt
RUN mkdir -p /var/www/certbot

# Expose ports
EXPOSE 80 443

# Start script
RUN echo '#!/bin/sh' > /start.sh && \
    echo '/generate-ssl.sh' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

CMD ["/start.sh"]