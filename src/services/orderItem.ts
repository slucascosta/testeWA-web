import apiService, { ApiService } from './api';
import IOrderItem from 'interfaces/models/orderItem';
import { IPaginationResponse, IPaginationParams } from 'interfaces/pagination';
import { Observable } from 'rxjs';

class OrderItemService {
  constructor(private apiService: ApiService) {}

  public list(orderId: number, params: IPaginationParams): Observable<IPaginationResponse<IOrderItem>> {
    return this.apiService.get(`/app/order/${orderId}/item`, params);
  }

  public save(orderId: number, model: Partial<IOrderItem>): Observable<IOrderItem> {
    return this.apiService.post(`/app/order/${orderId}/item`, model);
  }

  public delete(orderId: number, id: number): Observable<void> {
    return this.apiService.delete(`/app/order/${orderId}/item/${id}`);
  }
}

const orderItemService = new OrderItemService(apiService);
export default orderItemService;
