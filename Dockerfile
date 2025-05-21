FROM registry.pea.co.th/developer/spend-analytics/web/spend-analytics-fe/base:stable AS builder

WORKDIR /app  

RUN npm run build

FROM nginx:stable-alpine

# # # Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# # # Copy nginx config file
COPY .kaniko/web/nginx/nginx.conf /etc/nginx/nginx.conf
COPY .kaniko/web/nginx/conf.d/ /etc/nginx/conf.d/

# # # Copy builder stage to nginx public folder
COPY --from=builder /app/build /usr/share/nginx/html

RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R 101:101 /var/cache/nginx

# Run as nginx
USER 101

CMD ["nginx", "-g", "daemon off;"]
