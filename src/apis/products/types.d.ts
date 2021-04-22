interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  price: number;
}

// interface ProductsList{
//   products: Product[];
// }

interface ProductCreateParams {
  name: string;
  description: string;
  price: string;
  comparePrice: string | null;
  costPerItem: string;
  barcode: string;
  sku: string;
  isPhysicalProduct: boolean;
  quantity: number | string;
  allowOutOfStockPurchase: boolean;
  imageUrls: string[];
}

interface ProductCreateResponse extends CommonApiError {
  product: Product;
}
