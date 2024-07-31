import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports:
    process.env.ENV == 'DEV'
      ? [
          ConfigModule.forRoot(),
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'admin',
            database: process.env.DB_NAME || 'faturrumahan',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          }),
          ProjectsModule,
          AuthModule,
          UsersModule,
          CategoriesModule,
        ]
      : [
          ConfigModule.forRoot(),
          TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DB_URL,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          }),
          ProjectsModule,
          AuthModule,
          UsersModule,
          CategoriesModule,
        ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
