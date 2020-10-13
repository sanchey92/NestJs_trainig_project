import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException, } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {password, username} = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const user = new User();
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const {password, username} = authCredentialsDto;
    const user = await this.findOne({username});
    if (user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null
    }
  }
}
