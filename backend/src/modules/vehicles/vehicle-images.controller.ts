import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { diskStorage } from 'multer';
import { vehicleImagesDir } from '../../config/uploads';
import { VehicleImagesService } from './vehicle-images.service';

function ensureUploadsDir(): void {
  fs.mkdirSync(vehicleImagesDir, { recursive: true });
}

@Controller('vehicles/:vehicleId/images')
export class VehicleImagesController {
  constructor(private readonly vehicleImagesService: VehicleImagesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req: Request, _file: Express.Multer.File, cb) => {
          ensureUploadsDir();
          cb(null, vehicleImagesDir);
        },
        filename: (_req: Request, file: Express.Multer.File, cb) => {
          const safeName = file.originalname.replace(/\s+/g, '_');
          const uniqueName = `${Date.now()}-${safeName}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadImage(
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    const image = await this.vehicleImagesService.createImage(
      vehicleId,
      file.filename,
    );
    return image;
  }

  @Delete(':imageId')
  @HttpCode(204)
  async deleteImage(
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ): Promise<void> {
    await this.vehicleImagesService.deleteImage(vehicleId, imageId);
  }
}
