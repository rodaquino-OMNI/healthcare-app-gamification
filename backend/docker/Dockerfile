# ==========================================
# AUSTA Healthcare SuperApp - Laravel API
# Multi-stage Dockerfile
# ==========================================

# ── Stage 1: Composer Dependencies ─────────────────────────────────────────
FROM composer:2 AS composer-deps

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-interaction

COPY . .
RUN composer dump-autoload --optimize --no-dev

# ── Stage 2: Production Image ─────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    icu-libs \
    libpq \
    libzip \
    oniguruma \
    && apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    icu-dev \
    libpq-dev \
    libzip-dev \
    oniguruma-dev \
    && docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    pcntl \
    bcmath \
    intl \
    opcache \
    zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/* /tmp/pear

# PHP configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY docker/php.ini "$PHP_INI_DIR/conf.d/99-custom.ini" 2>/dev/null || true

# OPcache configuration
RUN echo "opcache.enable=1" >> "$PHP_INI_DIR/conf.d/opcache.ini" \
    && echo "opcache.memory_consumption=256" >> "$PHP_INI_DIR/conf.d/opcache.ini" \
    && echo "opcache.interned_strings_buffer=16" >> "$PHP_INI_DIR/conf.d/opcache.ini" \
    && echo "opcache.max_accelerated_files=20000" >> "$PHP_INI_DIR/conf.d/opcache.ini" \
    && echo "opcache.validate_timestamps=0" >> "$PHP_INI_DIR/conf.d/opcache.ini" \
    && echo "opcache.save_comments=1" >> "$PHP_INI_DIR/conf.d/opcache.ini"

# Nginx configuration for internal use (serves PHP-FPM)
RUN mkdir -p /run/nginx && \
    echo 'server { \
    listen 8000; \
    server_name _; \
    root /var/www/html/public; \
    index index.php; \
    location / { \
        try_files $uri $uri/ /index.php?$query_string; \
    } \
    location ~ \.php$ { \
        fastcgi_pass 127.0.0.1:9000; \
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name; \
        include fastcgi_params; \
        fastcgi_hide_header X-Powered-By; \
    } \
    location ~ /\.(?!well-known).* { \
        deny all; \
    } \
}' > /etc/nginx/http.d/default.conf

# Supervisor configuration
COPY docker/supervisord.conf /etc/supervisord.conf

# Application code
WORKDIR /var/www/html

COPY --from=composer-deps /app/vendor ./vendor
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Cache configuration for production
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]

# ── Stage 3: Development (optional target) ────────────────────────────────
FROM php:8.3-fpm-alpine AS development

RUN apk add --no-cache \
    curl \
    icu-libs \
    libpq \
    libzip \
    oniguruma \
    && apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    icu-dev \
    libpq-dev \
    libzip-dev \
    oniguruma-dev \
    && docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    pcntl \
    bcmath \
    intl \
    zip \
    && pecl install redis xdebug \
    && docker-php-ext-enable redis xdebug \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/* /tmp/pear

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
