import { Module } from '@nestjs/common';
import { CategoryCodeFirstResolver } from './resolvers/category.codefirst.resolver';
import { ProductCodeFirstResolver } from './resolvers/product.codefirst.resolver';
import { TaskCodeFirstResolver } from './resolvers/task.resolver';

// Import our existing modules
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { TaskModule } from '../modules/task/task.module';

@Module({
  imports: [CategoryModule, ProductModule, TaskModule],
  providers: [
    CategoryCodeFirstResolver,
    ProductCodeFirstResolver,
    TaskCodeFirstResolver,
  ],
})
export class GraphqlModule {}

