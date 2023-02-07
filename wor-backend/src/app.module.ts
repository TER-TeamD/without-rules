import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameEngineModule } from './game-engine/game-engine.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URI),
    GameEngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
