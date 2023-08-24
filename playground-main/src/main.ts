import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
  Catch,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'reflect-metadata';

@Catch(BadRequestException)
export class ValidationExceptionFilter
  implements ExceptionFilter<BadRequestException>
{
  public catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.code(400).send({
      statusCode: 400,
      error: `Unprocessable Entity`,
      message: exception.message,
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: console,
    },
  );
  const config = new DocumentBuilder()
    .setTitle('Casino example')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        console.log(errors);
        return new BadRequestException('Validation error');
      },
    }),
  );
  app.useGlobalFilters(new ValidationExceptionFilter());

  await app.listen(3005);
}

bootstrap();
