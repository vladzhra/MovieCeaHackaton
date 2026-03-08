import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    isAdmin: false,
    createdAt: new Date(),
  };

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([
        {
          id: mockUser.id,
          email: mockUser.email,
          isAdmin: mockUser.isAdmin,
          createdAt: mockUser.createdAt,
        },
      ]);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });
});
