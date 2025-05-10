// Một file handler riêng biệt để triển khai logic tìm kiếm chuyến xe nối

/**
 * Handler xử lý logic tìm kiếm chuyến nối
 * 
 * Nếu không có chuyến trực tiếp từ điểm đi đến điểm đến:
 * 1. Tìm tất cả chuyến đi từ điểm đi (A) đến bất kỳ điểm trung gian nào
 * 2. Tìm tất cả chuyến đi từ bất kỳ điểm trung gian nào đến điểm đến (C)
 * 3. Xác định điểm trung chuyển (B) có thể kết nối các chuyến đi từ A->B và B->C
 * 4. Kiểm tra thời gian chờ hợp lý giữa các chuyến 
 */

import { Injectable } from '@nestjs/common';
import { format, addDays, parseISO, differenceInMinutes } from 'date-fns';

@Injectable()
export class TripConnectedHandler {
  
  /**
   * Xử lý tìm kiếm chuyến nối
   * @param data Dữ liệu tìm kiếm từ client
   * @param tripService Service xử lý chuyến đi
   * @param routeService Service xử lý tuyến đường
   */
  async findConnectedTrips(data: any, tripService: any, routeService: any) {
    const { departureId, destinationId, departureDate } = data;
    
    console.log('Tiến hành tìm kiếm chuyến nối với dữ liệu:', {
      departureId,
      destinationId,
      departureDate
    });
    
    try {
      // 1. Tìm tất cả chuyến đi từ điểm đi (departureId)
      const tripsFromDeparture = await this.findTripsFromDeparture(departureId, departureDate, tripService);
      console.log(`Tìm thấy ${tripsFromDeparture.length} chuyến đi từ điểm xuất phát`);
      
      // 2. Tìm tất cả chuyến đi đến điểm đích (destinationId)
      // Tìm kiếm cho ngày khởi hành và ngày kế tiếp để tìm chuyến nối qua đêm
      const baseDateObj = parseISO(departureDate);
      const nextDayDate = format(addDays(baseDateObj, 1), 'yyyy-MM-dd');
      
      // Tìm các chuyến đi cho cả ngày xuất phát và ngày kế tiếp
      const tripsToDestinationBaseDay = await this.findTripsToDestination(
        destinationId, 
        departureDate, 
        tripService
      );
      
      const tripsToDestinationNextDay = await this.findTripsToDestination(
        destinationId, 
        nextDayDate, 
        tripService
      );
      
      // Gộp các chuyến đi lại
      const tripsToDestination = [
        ...tripsToDestinationBaseDay,
        ...tripsToDestinationNextDay
      ];
      
      console.log(`Tìm thấy ${tripsToDestination.length} chuyến đi đến điểm đích (bao gồm ngày kế tiếp)`);
      
      // 3. Tìm các điểm kết nối tiềm năng
      const connectedTrips = await this.findPotentialConnections(
        tripsFromDeparture,
        tripsToDestination
      );
      
      console.log(`Tìm thấy ${connectedTrips.length} chuyến nối tiềm năng`);
      
      return {
        status: 200,
        message: 'Tìm kiếm chuyến nối thành công',
        result: connectedTrips
      };
    } catch (error) {
      console.error('Lỗi khi tìm kiếm chuyến nối:', error);
      return {
        status: 500,
        message: 'Đã xảy ra lỗi khi tìm kiếm chuyến nối',
        error: error.message,
        result: []
      };
    }
  }
  
  /**
   * Tìm tất cả chuyến đi từ điểm xuất phát
   */
  private async findTripsFromDeparture(departureId: number, departureDate: string, tripService: any) {
    // Giả định có một service/repository để lấy dữ liệu
    // Cần thay thế bằng triển khai thực tế phù hợp với kiến trúc hệ thống
    console.log(`Tìm kiếm tất cả chuyến đi từ điểm xuất phát ${departureId} vào ngày ${departureDate}`);
    
    // Đây chỉ là giả lập, cần thay thế bằng gọi service thật
    return [];
  }
  
  /**
   * Tìm tất cả chuyến đi đến điểm đích
   */
  private async findTripsToDestination(destinationId: number, departureDate: string, tripService: any) {
    // Giả định có một service/repository để lấy dữ liệu
    // Cần thay thế bằng triển khai thực tế phù hợp với kiến trúc hệ thống
    console.log(`Tìm kiếm tất cả chuyến đi đến điểm đích ${destinationId} vào ngày ${departureDate}`);
    
    // Đây chỉ là giả lập, cần thay thế bằng gọi service thật
    return [];
  }
  
  /**
   * Tìm các kết nối tiềm năng giữa các chuyến đi
   */
  private async findPotentialConnections(tripsFromDeparture: any[], tripsToDestination: any[]) {
    const connectedTrips = [];
    
    // Kiểm tra các kết nối có thể giữa các chuyến đi
    for (const firstTrip of tripsFromDeparture) {
      for (const secondTrip of tripsToDestination) {
        // Kiểm tra xem có thể kết nối được không
        // Điểm đến của chuyến 1 phải trùng với điểm đi của chuyến 2
        if (firstTrip.destinationInfo.pointId === secondTrip.departureInfo.pointId) {
          // Log thông tin chi tiết để debug
          console.log(`Kiểm tra kết nối: 
            Chuyến 1: ${firstTrip.departureInfo.pointName} -> ${firstTrip.destinationInfo.pointName}
            Thời gian: ${firstTrip.departureTime} -> ${firstTrip.arrivalTime}
            Chuyến 2: ${secondTrip.departureInfo.pointName} -> ${secondTrip.destinationInfo.pointName}
            Thời gian: ${secondTrip.departureTime} -> ${secondTrip.arrivalTime}
          `);
          
          // Kiểm tra thời gian chờ hợp lý
          const waitingTimeResult = this.calculateWaitingTime(firstTrip, secondTrip);
          
          // Log thông tin thời gian chờ
          console.log(`Thời gian chờ: ${waitingTimeResult.waitingTimeMinutes} phút, hợp lệ: ${waitingTimeResult.isValid}`);
          
          // Chỉ xem xét các kết nối có thời gian chờ hợp lý (30 phút đến 4 giờ) và thời gian đến của chuyến 1 phải trước thời gian khởi hành của chuyến 2
          if (waitingTimeResult.isValid) {
            connectedTrips.push(this.createConnectedTrip(firstTrip, secondTrip, waitingTimeResult.waitingTimeMinutes));
          }
        }
      }
    }
    
    // Sắp xếp kết quả theo tổng thời gian đi
    return connectedTrips.sort((a, b) => a.totalDuration - b.totalDuration);
  }
  
  /**
   * Tính thời gian chờ giữa hai chuyến đi
   * Cải tiến để xử lý đúng khi chuyến kết nối ở ngày kế tiếp
   */
  private calculateWaitingTime(firstTrip: any, secondTrip: any) {
    // Chuyển đổi chuỗi thời gian thành đối tượng Date
    const firstTripArrival = new Date(firstTrip.arrivalTime);
    const secondTripDeparture = new Date(secondTrip.departureTime);
    
    // Log các mốc thời gian để debug
    console.log(`Chi tiết thời gian:
      Chuyến 1 đến: ${firstTripArrival.toISOString()}
      Chuyến 2 đi: ${secondTripDeparture.toISOString()}
    `);
    
    // Tính thời gian chờ (phút)
    const waitingTimeMinutes = differenceInMinutes(secondTripDeparture, firstTripArrival);
    
    // Kiểm tra tính hợp lệ của thời gian chờ
    // 1. Thời gian đến của chuyến 1 phải trước thời gian đi của chuyến 2
    // 2. Thời gian chờ phải trong khoảng hợp lý (30 phút đến 4 giờ)
    const isValid = waitingTimeMinutes > 0 && waitingTimeMinutes >= 30 && waitingTimeMinutes <= 240;
    
    return {
      waitingTimeMinutes,
      isValid
    };
  }
  
  /**
   * Tạo đối tượng chuyến nối
   */
  private createConnectedTrip(firstTrip: any, secondTrip: any, waitingTimeMinutes: number) {
    // Tính tổng thời gian
    const totalDuration = firstTrip.duration + secondTrip.duration + waitingTimeMinutes;
    
    // Tính tổng giá
    const totalPrice = firstTrip.route.base_price + secondTrip.route.base_price;
    
    // Định dạng thời gian chờ
    const waitingTime = this.formatWaitingTime(waitingTimeMinutes);
    
    // Thông tin điểm kết nối
    const connectionPoint = {
      pointId: firstTrip.destinationInfo.pointId,
      pointName: firstTrip.destinationInfo.pointName,
      province: {
        id: firstTrip.destinationInfo.provinceId,
        name: firstTrip.destinationInfo.province
      }
    };
    
    // Trả về đối tượng chuyến nối với thông tin cải tiến
    return {
      firstTrip,
      secondTrip,
      connectionPoint,
      waitingTime,
      waitingTimeMinutes, // Thêm thời gian chờ dạng số để dễ sắp xếp
      totalDuration,
      totalPrice,
      isNextDayConnection: this.isNextDayConnection(firstTrip, secondTrip), // Đánh dấu kết nối qua ngày
      connectionDetails: {
        firstTripArrival: firstTrip.arrivalTime,
        secondTripDeparture: secondTrip.departureTime,
        waitingTimeMinutes
      }
    };
  }
  
  /**
   * Kiểm tra xem kết nối có qua ngày không
   */
  private isNextDayConnection(firstTrip: any, secondTrip: any): boolean {
    const firstTripArrivalDate = new Date(firstTrip.arrivalTime).toISOString().split('T')[0];
    const secondTripDepartureDate = new Date(secondTrip.departureTime).toISOString().split('T')[0];
    
    return firstTripArrivalDate !== secondTripDepartureDate;
  }
  
  /**
   * Định dạng thời gian chờ
   */
  private formatWaitingTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}p`;
    }
    
    return `${mins} phút`;
  }
} 