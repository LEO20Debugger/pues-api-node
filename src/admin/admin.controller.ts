import { 
  Controller, 
  Get, 
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Get current admin user profile
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return {
      message: 'Profile retrieved successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // Dashboard Statistics
  @Get('dashboard/stats')
  async getDashboardStats() {
    const stats = await this.adminService.getDashboardStats();
    return {
      message: 'Dashboard statistics retrieved successfully',
      stats,
    };
  }
}
