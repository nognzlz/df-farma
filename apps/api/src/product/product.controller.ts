import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO, UpdateProductDTO } from './dto/product.dto';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post()
  createProduct(@Body() product: CreateProductDTO) {
    const { name, price, description } = product;

    return this.productService.createProduct(name, price, description);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    this.productService.deleteProduct(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updatedFields: UpdateProductDTO,
  ): Product {
    return this.productService.updateProduct(id, updatedFields);
  }
}
