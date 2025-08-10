import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '@/src/auth/auth.service';
import { signUpDto, signInDto } from '@/src/auth/dto/auth.dto';
import { ZodValidationPipe } from '@/src/utils/zod-validation.pipe';
import { z } from 'zod';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** User sign up */
  @Post('signup')
  public async signUp(
    @Body(new ZodValidationPipe(signUpDto))
    body: z.infer<typeof signUpDto>,
  ) {
    return this.authService.signUp(body);
  }

  /** User login*/
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Body(new ZodValidationPipe(signInDto))
    body: z.infer<typeof signInDto>,
  ) {
    return this.authService.signIn(body);
  }
}
