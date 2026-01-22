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
import { diskStorage } from 'multer';
import { userImagesDir } from '../../config/uploads';
import { UserImagesService } from './user-images.service';

function ensureUploadsDir(): void {
  fs.mkdirSync(userImagesDir, { recursive: true });
}

@Controller('users/:userId/images')
export class UserImagesController {
  constructor(private readonly userImagesService: UserImagesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req: Request, _file: Express.Multer.File, cb) => {
          ensureUploadsDir();
          cb(null, userImagesDir);
        },
        filename: (_req: Request, file: Express.Multer.File, cb) => {
          const safeName = file.originalname.replace(/\\s+/g, '_');
          const uniqueName = `${Date.now()}-${safeName}`;
          cb(null, uniqueName);
        },
      }),
    })
  )
  async uploadImage(
    @Param('userId', ParseIntPipe) userId: number,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.userImagesService.createImage(userId, file.filename);
  }

  @Delete(':imageId')
  @HttpCode(204)
  async deleteImage(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('imageId', ParseIntPipe) imageId: number
  ): Promise<void> {
    await this.userImagesService.deleteImage(userId, imageId);
  }
}
