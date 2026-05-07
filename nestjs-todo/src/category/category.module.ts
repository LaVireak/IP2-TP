import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';

@Module({
  providers: [CategoryService],
  exports: [CategoryService] // <-- IMPORTANT for Step 4
})
export class CategoryModule {}
