import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('comal-xpress/api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Esto eliminará automáticamente las propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Esto lanzará un error si se envían propiedades no definidas en el DTO
  }));

   const config = new DocumentBuilder()
    .setTitle('ComalXpress API')
    .setDescription('Restaurant ComalXpress ')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
