import { Controller, Get, Patch, Body, UseGuards, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RoleType } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('me/roles/:role')
  addRole(@CurrentUser('id') userId: string, @Param('role') role: RoleType) {
    return this.usersService.addRole(userId, role);
  }

  @Get('me/stats')
  getStats(@CurrentUser('id') userId: string) {
    return this.usersService.getStats(userId);
  }
}
