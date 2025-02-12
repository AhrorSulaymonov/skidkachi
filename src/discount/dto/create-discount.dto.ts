
export class CreateDiscountDto {
  storeId: number;
  title: string;
  description: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  categoryId: number;
  discountValue: number;
  special_link: string;
  discountTypeId: number;
}
