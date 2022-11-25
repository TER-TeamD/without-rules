FROM cirrusci/flutter as building

COPY . /app
WORKDIR /app

FROM busybox:latest as production

EXPOSE 3000

COPY --from=building /app/build/web /dist
WORKDIR /dist

CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]

