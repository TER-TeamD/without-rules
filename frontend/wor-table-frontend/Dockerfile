
FROM cirrusci/flutter:latest

WORKDIR /app
COPY . .

RUN flutter pub get
RUN flutter build web

EXPOSE 80
CMD [ "flutter", "run", "--release", "--web" ]
