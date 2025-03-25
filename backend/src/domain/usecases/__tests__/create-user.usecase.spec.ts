import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CreateUserUseCase } from '../create-user.usecase';
import { USER_REPOSITORY } from '../../repositories/user.repository';

jest.mock('bcrypt');

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: any;

  const mockUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository
        }
      ]
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get(USER_REPOSITORY);

    jest.clearAllMocks();
  });

  it('should create a new user successfully', async () => {
    const params = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const hashedPassword = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(mockUser);

    const result = await useCase.execute(params);

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(params.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(params.password, 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...params,
      password: hashedPassword
    });
  });

  it('should throw error if user already exists', async () => {
    const params = {
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123'
    };

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    await expect(useCase.execute(params))
      .rejects
      .toThrow('User already exists');

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(params.email);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should handle password hashing failure', async () => {
    const params = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing failed'));

    await expect(useCase.execute(params))
      .rejects
      .toThrow('Hashing failed');

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(params.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(params.password, 10);
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should handle repository creation failure', async () => {
    const params = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const hashedPassword = 'hashed_password';
    mockUserRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(params))
      .rejects
      .toThrow('Database error');

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(params.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(params.password, 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...params,
      password: hashedPassword
    });
  });

  it('should preserve original user data except for hashed password', async () => {
    const params = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    const hashedPassword = 'hashed_password';
    mockUserRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockUserRepository.create.mockResolvedValue({
      ...mockUser,
      name: params.name,
      email: params.email,
      password: hashedPassword
    });

    const result = await useCase.execute(params);

    expect(result.name).toBe(params.name);
    expect(result.email).toBe(params.email);
    expect(result.password).toBe(hashedPassword);
    expect(result.password).not.toBe(params.password);
  });
}); 