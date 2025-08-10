import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ResponseManager } from '@/src/utils/response-manager.utils';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { DbService } from '@/src/db/db.service';
import { adminUsers } from '@/src/db/schema';
import { z } from 'zod';
import { signUpDto, signInDto } from '@/src/auth/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbService: DbService,
  ) {}

  /** User sign up */
  public async signUp(body: z.infer<typeof signUpDto>) {
    const { email, password, name } = body;

    // Check if user already exists
    const existing = await this.dbService.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert new user
    await this.dbService.db.insert(adminUsers).values({
      name,
      email,
      passwordHash,
    });

    // Fetch newly created user
    const [newUser] = await this.dbService.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (!newUser) {
      throw new ConflictException('Failed to create user');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: newUser.id,
      email: newUser.email,
    });

    return ResponseManager.standardResponse(
      'success',
      201,
      'User created successfully',
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      },
    );
  }

  /** User login */
  public async signIn(body: z.infer<typeof signInDto>) {
    const { email, password } = body;

    // Find user
    const [user] = await this.dbService.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (!user || user.deleted) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return ResponseManager.standardResponse(
      'success',
      200,
      'Login successful',
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    );
  }

  /** Validate user by ID (internal use for guards) */
  public async validateUser(userId: number) {
    const [user] = await this.dbService.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, userId))
      .limit(1);

    if (!user || user.deleted) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
