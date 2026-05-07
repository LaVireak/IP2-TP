import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  private products = [
    { id: 1, name: 'Laptop', price: 1200, categoryId: 1 },
    { id: 2, name: 'T-Shirt', price: 20, categoryId: 2 },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find(p => p.id === id);
  }

  findByCategory(categoryId: number) {
    return this.products.filter((p) => p.categoryId === categoryId);
  }

  create(data: { name: string; price: number; categoryId: number }) {
    const newProduct = {
      id: this.products.length + 1,
      ...data,
    };
    this.products.push(newProduct);
    return newProduct;
  }
}
