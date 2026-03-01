<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Arrancar la aplicación

1.- Descargar dependencias

```bash
yarn install
```

2.- Copiar .env.example y renombrarlo a .env

3.- Levantar DB

```bash
docker compose up -d
```

4.- Levantar API en modo desarrollo

```bash
yarn run start:dev
```

5.- Url base para todos los endpoints

```
localhost:3000/comal-xpress/api/v1
```