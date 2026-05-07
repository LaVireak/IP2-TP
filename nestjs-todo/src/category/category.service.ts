import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  private categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
  ];

  findAll() {
    return this.categories;
  }

  findOne(id: number) {
    return this.categories.find(c => c.id === id);
  }

  create(data: { name: string }) {
    const newCategory = {
      id: this.categories.length + 1,
      name: data.name,
    };
    this.categories.push(newCategory);
    return newCategory;
  }
}
