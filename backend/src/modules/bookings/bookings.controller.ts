import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  BookingWithDetails,
  type CreateBookingDto,
  type UpdateBookingDto,
} from './entities/booking.entity';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  listBookings(
    @Query('vehicleId') vehicleId?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<BookingWithDetails[]> {
    return this.bookingsService.listBookings({
      vehicleId: vehicleId ? parseInt(vehicleId, 10) : undefined,
      userId: userId ? parseInt(userId, 10) : undefined,
      status,
      startDate,
      endDate,
    });
  }

  @Get('available-vehicles')
  async getAvailableVehicles(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ vehicleIds: number[] }> {
    const vehicleIds = await this.bookingsService.getAvailableVehicleIds(
      startDate,
      endDate,
    );
    return { vehicleIds };
  }

  @Get(':id')
  getBooking(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookingWithDetails> {
    return this.bookingsService.getBooking(id);
  }

  @Post()
  createBooking(
    @Body() payload: CreateBookingDto,
  ): Promise<BookingWithDetails> {
    return this.bookingsService.createBooking(payload);
  }

  @Put(':id')
  updateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookingDto,
  ): Promise<BookingWithDetails> {
    return this.bookingsService.updateBooking(id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBooking(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.bookingsService.deleteBooking(id);
  }
}
