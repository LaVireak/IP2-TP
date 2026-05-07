import { Module } from '@nestjs/common';
import { ProductService } from './product.service';

@Module({
  providers: [ProductService],
  exports: [ProductService] // <-- IMPORTANT for Step 4
})
export class ProductModule {}
