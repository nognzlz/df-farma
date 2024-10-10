import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { v4 } from 'uuid';
import { UpdateProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  products: Product[] = [];

  getAllProducts(): Product[] {
    return this.products;
  }

  createProduct(name: string, price: number, description: string): Product {
    const product = {
      id: v4(),
      name,
      price,
      description,
    };

    this.products.push(product);

    return product;
  }

  deleteProduct(id: string) {
    this.products = this.products.filter((p) => p.id !== id);
  }

  getProductById(id: string) {
    return this.products.find((p) => p.id === id);
  }

  updateProduct(id: string, updatedFields: UpdateProductDTO): Product {
    const product = this.getProductById(id);
    const newProduct = Object.assign(product, updatedFields);

    this.products = this.products.map((p) => {
      return p.id === id ? newProduct : p;
    });

    return newProduct;
  }
}
