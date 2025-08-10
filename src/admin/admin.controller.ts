import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@/src/auth/current-user.decorator';
import { AdminService } from './admin.service';
import { ResponseManager } from '@/src/utils/response-manager.utils';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Get current admin user profile
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return ResponseManager.standardResponse(
      'success',
      200,
      'Profile retrieved successfully',
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    );
  }

  // Dashboard Statistics
  @Get('dashboard/stats')
  public async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
