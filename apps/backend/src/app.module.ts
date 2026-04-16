import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { NewsModule } from './news/news.module';

@Module({
    imports: [NewsModule],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppModule { }
