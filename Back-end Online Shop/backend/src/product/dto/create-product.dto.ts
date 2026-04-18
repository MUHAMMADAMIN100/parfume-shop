export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  brand?: string;
  sizes?: any;
  stock?: number;
}
