import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import argon2 from 'argon2';
import { UUID } from 'crypto';
import crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  private async hash(data: string) {
    return await argon2.hash(data);
  }

  private async compare(hash: string, plain: string) {
    return await argon2.verify(hash, plain);
  }

  async signup(username: string, email: string, password: string) {
    const existingEmail = await this.usersRepo.findOne({ where: { email } });
    if (existingEmail) throw new BadRequestException('Email already in use');
    const existingUsername = await this.usersRepo.findOne({
      where: { username },
    });
    if (existingUsername)
      throw new BadRequestException('Username already taken');

    const hashed = await this.hash(password);
    const user = this.usersRepo.create({ username, email, password: hashed });
    return this.usersRepo.save(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;
    const ok = await this.compare(user.password, password);
    if (!ok) return null;
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRATION'),
    });

    const hashedRefresh = await this.hash(refreshToken);
    user.hashedRefreshToken = hashedRefresh;
    await this.usersRepo.save(user);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: UUID, refreshToken: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException();

    const isMatch = await this.compare(user.hashedRefreshToken, refreshToken);
    if (!isMatch) throw new UnauthorizedException();

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const newRefresh = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRATION'),
    });
    user.hashedRefreshToken = await this.hash(newRefresh);
    await this.usersRepo.save(user);

    return { accessToken, refreshToken: newRefresh };
  }

  async logout(userId: UUID) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) return;
    user.hashedRefreshToken = null;
    await this.usersRepo.save(user);
  }

  async requestPasswordReset(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('No user with that email');

    const token = crypto.randomBytes(32).toString('hex');
    const hashed = await this.hash(token);
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60);
    await this.usersRepo.save(user);

    const resetUrl = `${this.config.get('FRONTEND_RESET_URL')}?token=${token}&email=${encodeURIComponent(email)}`;
    await this.mailService.sendResetPassword(email, resetUrl);

    return { message: 'Reset email sent' };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires)
      throw new BadRequestException('Invalid or expired token');
    if (user.resetPasswordExpires.getTime() < Date.now())
      throw new BadRequestException('Expired token');

    const matches = await this.compare(user.resetPasswordToken, token);
    if (!matches) throw new BadRequestException('Invalid token');

    user.password = await this.hash(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.usersRepo.save(user);

    return { message: 'Password reset successful' };
  }
}
