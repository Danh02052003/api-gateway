import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TripService } from './trip.service';

@Controller('v2/trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('/search')
  seachTripOnPlatform(@Body() data: any) {
    console.log('Search Trip API called with data:', data);
    return this.tripService.seachTripOnPlatform(data);
  }
  
  @Post('/search-connected')
  findConnectedTrips(@Body() data: any) {
    console.log('Search Connected Trips API called with detailed data:', JSON.stringify(data));
    return this.tripService.findConnectedTrips(data);
  }
  
  @Get('/get-trip-detail-on-platform/:id')
  getTripDetailOnPlatform(@Param('id') id: any) {
    return this.tripService.getTripDetailOnPlatform(id);
  }

  @Post('/get-trip-by-date-and-route')
  getTripsByDateAndRouteAPI(@Body() data: any) {
    return this.tripService.getTripsByDateAndRouteAPI(data);
  }

  @Get('/get-point-up-by-trip/:id')
  getPointUpByTrip(@Param('id') id: any) {
    return this.tripService.getPointUpByTrip(id);
  }

  @Get('/get-point-down-by-trip/:id')
  getPointDownByTrip(@Param('id') id: any) {
    return this.tripService.getPointDownByTrip(id);
  }
}
