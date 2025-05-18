import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(id: string, password: string, role: UserRole): Promise<User> {
    const existingUser = await this.userModel.findOne({ id }).exec();
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      id,
      password: hashedPassword,
      role,
    });

    return user.save();
  }

  async validateUser(id: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
    });

    // Store hashed refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findOneAndUpdate(
      { id: user.id },
      { refreshToken: hashedRefreshToken },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.configService.get<string>('JWT_EXPIRATION'),
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userModel.findOne({ id: userId }).exec();
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.configService.get<string>('JWT_EXPIRATION'),
    };
  }
}
