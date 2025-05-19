import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../auth/schemas/user.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  const users = [
    {
      username: 'admin',
      password: 'admin1234',
      role: UserRole.ADMIN,
    },
    {
      username: 'operator',
      password: 'operator1234',
      role: UserRole.OPERATOR,
    },
    {
      username: 'auditor',
      password: 'auditor1234',
      role: UserRole.AUDITOR,
    },
    {
      username: 'user',
      password: 'user1234',
      role: UserRole.USER,
    },
  ];

  console.log('Starting to seed users...');

  for (const user of users) {
    try {
      await authService.register(user.username, user.password, user.role);
      console.log(`Created user: ${user.username} (${user.role})`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`User already exists: ${user.username}`);
      } else {
        console.error(`Failed to create user ${user.username}:`, error.message);
      }
    }
  }

  console.log('Seeding completed!');
  await app.close();
}

bootstrap().catch(console.error); 