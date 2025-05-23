import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OfficeService {
  constructor(
    @Inject('BUS_MANAGEMENT_SERVICE') private readonly office: ClientProxy,
  ) {}
  createOffice(data: any) {
    console.log('data', data);
    return this.office.send('create_office', data);
  }
  getOfficesByCompany(id: any) {
    return this.office.send('get_offices_by_company', id);
  }
  getOfficeNameByCompany(id: number) {
    console.log('id', id);
    return this.office.send('get_office_name_by_company', id);
  }
  updateOffice(id: number, data: any) {
    return this.office.send('update_office', { id, data });
  }
  deleteOffice(id: number) {
    return this.office.send('delete_office', id);
  }
}
