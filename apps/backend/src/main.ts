
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: [
            'http://localhost:5173',  // Vite dev server
            'http://localhost:4173',  // Vite preview
            /\.vercel\.app$/,         // Vercel deployments
        ],
        methods: ['GET'],
    });

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
