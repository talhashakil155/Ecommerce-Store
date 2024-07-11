import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('attachments')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('attachment[]'))
  uploadFile(@UploadedFiles() attachment: Array<Express.Multer.File>) {
    // console.log(attachment);
    const base64String = attachment[0]['buffer'].toString('base64');
    return [
      {
        id: '1',
        original: base64String,
        thumbnail: base64String,
        changed: true
      },
    ];
  }
}

