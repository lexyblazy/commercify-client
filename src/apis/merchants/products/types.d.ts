interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  price: number;
}

interface MerchantProductsListResponse {
  products: Product[];
}
