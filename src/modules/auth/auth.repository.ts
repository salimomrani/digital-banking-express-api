import { User } from '../../models/user.model';

const users: Array<User & { password: string }> = [
  {
    id: 'USR-1001',
    email: 'awa.traore@example.com',
    name: 'Awa Traoré',
    roles: ['customer'],
    password: 'banking'
  }
];

class AuthRepository {
  findByEmail(email: string): (User & { password: string }) | undefined {
    return users.find((user) => user.email === email);
  }

  getDefaultUser(): User {
    const { password: _password, ...user } = users[0];
    void _password;
    return user;
  }
}

export default new AuthRepository();
