import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  BookingWithDetails,
  CreateBookingDto,
  UpdateBookingDto,
} from './entities/booking.entity';
import { BookingFilters, BookingsRepository } from './bookings.repository';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  listBookings(filters: BookingFilters = {}): Promise<BookingWithDetails[]> {
    return this.bookingsRepository.listBookings(filters);
  }

  async getBooking(id: number): Promise<BookingWithDetails> {
    const booking = await this.bookingsRepository.getBookingById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async createBooking(input: CreateBookingDto): Promise<BookingWithDetails> {
    // Validate time order
    if (new Date(input.endTime) <= new Date(input.startTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    // Check for overlapping bookings
    const conflict = await this.bookingsRepository.findOverlappingBooking(
      input.vehicleId,
      input.startTime,
      input.endTime,
    );

    if (conflict) {
      throw new ConflictException({
        statusCode: 409,
        message: `Time conflict: Vehicle is already booked from ${conflict.startTime} to ${conflict.endTime}`,
        error: 'Conflict',
        conflictingBooking: conflict,
      });
    }

    return this.bookingsRepository.createBooking(input);
  }

  async updateBooking(
    id: number,
    input: UpdateBookingDto,
  ): Promise<BookingWithDetails> {
    // Get existing booking to check it exists
    const existing = await this.bookingsRepository.getBookingById(id);
    if (!existing) {
      throw new NotFoundException('Booking not found');
    }

    // If time is being updated, validate
    const startTime = input.startTime ?? existing.startTime;
    const endTime = input.endTime ?? existing.endTime;
    const vehicleId = input.vehicleId ?? existing.vehicleId;

    if (new Date(endTime) <= new Date(startTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    // Check for overlapping bookings (excluding current booking)
    const conflict = await this.bookingsRepository.findOverlappingBooking(
      vehicleId,
      startTime,
      endTime,
      id,
    );

    if (conflict) {
      throw new ConflictException({
        statusCode: 409,
        message: `Time conflict: Vehicle is already booked from ${conflict.startTime} to ${conflict.endTime}`,
        error: 'Conflict',
        conflictingBooking: conflict,
      });
    }

    const updated = await this.bookingsRepository.updateBooking(id, input);
    if (!updated) {
      throw new NotFoundException('Booking not found');
    }

    return updated;
  }

  async deleteBooking(id: number): Promise<void> {
    const deleted = await this.bookingsRepository.deleteBooking(id);
    if (!deleted) {
      throw new NotFoundException('Booking not found');
    }
  }

  async getAvailableVehicleIds(
    startDate: string,
    endDate: string,
  ): Promise<number[]> {
    return this.bookingsRepository.getAvailableVehicleIds(startDate, endDate);
  }
}
