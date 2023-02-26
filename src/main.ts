import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session";
import * as passport from "passport";

const MongoStore = require('connect-mongo');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: "a titok",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000*60*60},
      store: MongoStore.create({
        mongoUrl: "mongodb+srv://freundl0509:HlU5wa4YT08Z5VFe@parkingapp.avuc3er.mongodb.net/?retryWrites=true&w=majority",
      }),
      //secure: true  - https kell hozzá
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
