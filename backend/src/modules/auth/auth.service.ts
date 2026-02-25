import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  // Authentication logic will be implemented in a dedicated step
  login(_dto: LoginDto): { message: string } {
    return { message: 'Not implemented' };
  }

  refreshToken(_refreshToken: string): { message: string } {
    return { message: 'Not implemented' };
  }

  logout(_userId: string): { message: string } {
    return { message: 'Not implemented' };
  }
}
