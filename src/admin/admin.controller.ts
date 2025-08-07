import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  UsePipes,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AdminService } from './admin.service';
import { ZodValidationPipe } from '../utils/zod-validation.pipe';
import { z } from 'zod';

// DTOs for validation
const createContactDto = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

const createProjectDto = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  completedAt: z.string().datetime().optional(),
});

const updateProjectDto = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  completedAt: z.string().datetime().optional(),
});

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

  // Contact Management
  @Get('contacts')
  async getAllContacts() {
    const contacts = await this.adminService.getAllContacts();
    return {
      message: 'Contacts retrieved successfully',
      contacts,
    };
  }

  @Get('contacts/:id')
  async getContact(@Param('id') id: string) {
    const contact = await this.adminService.getContact(parseInt(id));
    return {
      message: 'Contact retrieved successfully',
      contact,
    };
  }

  @Delete('contacts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteContact(@Param('id') id: string) {
    await this.adminService.deleteContact(parseInt(id));
    return { message: 'Contact deleted successfully' };
  }

  // Project Management
  @Get('projects')
  async getAllProjects() {
    const projects = await this.adminService.getAllProjects();
    return {
      message: 'Projects retrieved successfully',
      projects,
    };
  }

  @Get('projects/:id')
  async getProject(@Param('id') id: string) {
    const project = await this.adminService.getProject(parseInt(id));
    return {
      message: 'Project retrieved successfully',
      project,
    };
  }

  @Post('projects')
  @UsePipes(new ZodValidationPipe(createProjectDto))
  async createProject(@Body() body: any) {
    const project = await this.adminService.createProject(body);
    return {
      message: 'Project created successfully',
      project,
    };
  }

  @Put('projects/:id')
  @UsePipes(new ZodValidationPipe(updateProjectDto))
  async updateProject(@Param('id') id: string, @Body() body: any) {
    const project = await this.adminService.updateProject(parseInt(id), body);
    return {
      message: 'Project updated successfully',
      project,
    };
  }

  @Delete('projects/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(@Param('id') id: string) {
    await this.adminService.deleteProject(parseInt(id));
    return { message: 'Project deleted successfully' };
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
