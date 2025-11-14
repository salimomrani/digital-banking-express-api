import { prisma } from '../../config/db';
import { User } from '../../models/user.model';

class AuthRepository {
  async findByEmail(email: string): Promise<(User & { password: string }) | undefined> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return undefined;
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      roles: ['customer'],
      password: user.password
    };
  }

  async getDefaultUser(): Promise<User> {
    const user = await prisma.user.findFirst();

    if (!user) {
      throw new Error('No users found in database');
    }

    return {
      id: user.id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      roles: ['customer']
    };
  }
}

export default new AuthRepository();
