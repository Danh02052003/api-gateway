import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TripConnectedHandler } from './trip-connected.handler';

@Injectable()
export class TripService {
  private tripConnectedHandler: TripConnectedHandler;

  constructor(
    @Inject('BUS_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
  ) {
    this.tripConnectedHandler = new TripConnectedHandler();
  }

  seachTripOnPlatform(data: any) {
    console.log('Sending request to Bus Management Service:', data);
    return this.client.send('search_trip_on_platform', data);
  }
  
  findConnectedTrips(data: any) {
    console.log('Tìm kiếm chuyến nối với dữ liệu:', data);
    // Giờ đây, chúng ta có hai lựa chọn:
    // 1. Gửi yêu cầu đến microservice (nếu microservice đã có handler)
    // 2. Xử lý trực tiếp trong API Gateway (cho mục đích thử nghiệm nhanh)
    
    // Lựa chọn 1: Gửi yêu cầu đến microservice
    return this.client.send('find_connected_trips', data);
    
    // Lựa chọn 2: Xử lý trực tiếp trong API Gateway (bình luận để sử dụng)
    // return this.tripConnectedHandler.findConnectedTrips(data, this, null);
  }
  
  getTripDetailOnPlatform(id: any) {
    console.log('Sending request to Bus Management Service:', id);
    return this.client.send('get_trip_detail_on_platform', id);
  }
  getTripsByDateAndRouteAPI(data: any) {
    console.log('Sending request to Bus Management Service:', data);
    return this.client.send('get_trips_by_date_and_route', data);
  }
  getPointUpByTrip(id: any) {
    console.log('Sending request to Bus Management Service:', id);
    return this.client.send('get_point_up_by_trip', id);
  }
  getPointDownByTrip(id: any) {
    console.log('Sending request to Bus Management Service:', id);
    return this.client.send('get_point_down_by_trip', id);
  }
}
