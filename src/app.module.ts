import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { TimeEntryModule } from './time-entry/time-entry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configServise: ConfigService) => ({
        type: 'postgres',
        host: configServise.get('TYPEORM_HOST'),
        port: configServise.get('TYPEORM_PORT'),
        username: configServise.get('TYPEORM_USERNAME'),
        password: configServise.get('TYPEORM_PASSWORD'),
        database: configServise.get('TYPEORM_DATABASE'),
        entities: [__dirname + configServise.get('TYPEORM_ENTITIES')],
        synchronize: Boolean(configServise.get('TYPEORM_SYNCHRONIZE')),
        logging: Boolean(configServise.get('TYPEORM_LOGGING')),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    TimeEntryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
