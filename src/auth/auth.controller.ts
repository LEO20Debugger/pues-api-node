import { Controller, Post, Body, UsePipes, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '@/src/auth/auth.service';
import { signUpDto, signInDto } from '@/src/auth/dto/auth.dto';
import { ZodValidationPipe } from '@/src/utils/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   /** User sign up */
  @Post('signup')
  @UsePipes(new ZodValidationPipe(signUpDto))
  async signUp(@Body() body: any) {
    return this.authService.signUp(body);
  }

   /** User login*/
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(signInDto))
  async signIn(@Body() body: any) {
    return this.authService.signIn(body);
  }
}
