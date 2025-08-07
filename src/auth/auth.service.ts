import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { adminUsers } from '@/src/db/schema';
import { type DrizzleD1Database } from 'drizzle-orm/d1';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('DATABASE') private readonly db: any
  ) {}

  /** User sign up */
  async signUp(body: { email: string; password: string; name: string }) {
    const { email, password, name } = body;

    // Check if user already exists
    const existingUser = await this.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await this.db
      .insert(adminUsers)
      .values({
        email,
        passwordHash,
        name,
      })
      .returning();

    // Generate JWT token
    const payload = { sub: newUser[0].id, email: newUser[0].email };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User created successfully',
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
      },
      token,
    };
  }

  /** User login*/
  async signIn(body: { email: string; password: string }) {
    const { email, password } = body;

    // Find user by email
    const users = await this.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0];

    // Check if user is deleted
    if (user.deleted) {
      throw new UnauthorizedException('Account has been deleted');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async validateUser(userId: number) {
    const users = await this.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, userId))
      .limit(1);

    if (users.length === 0) {
      return null;
    }

    const user = users[0];

    if (user.deleted) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
