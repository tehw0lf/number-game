FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/apps/number-game/browser /usr/share/nginx/html
