import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ✅ 1. Add these 3 imports
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

// ... (your other module imports stay the same)
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { User } from './modules/user/user.entity';
import { Task } from './modules/task/task.entity';
import { ReceiptsModule } from './receipts/receipts.module';
import { Receipt } from './database/entities/receipts.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { CoreModule } from './core/core.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    // ✅ 2. Add the GraphQL Module here
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      
      // typePaths: [join(process.cwd(), 'src/graphql/schema/*.graphql')], 
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'), 
      
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'todo.sqlite',
      entities: [User, Task, Receipt],
      synchronize: true, // use only in development!
    }),
    
    // ... all your other modules
    UserModule,
    TaskModule,
    ReceiptsModule,
    NotificationsModule,
    OrdersModule,
    CoreModule,
    CategoryModule,
    ProductModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
