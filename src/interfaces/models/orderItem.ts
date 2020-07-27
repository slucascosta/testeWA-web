export default interface IOrderItem {
  id?: number;
  description: string;
  quantity: number;
  price: number;
  orderId?: number;
}
