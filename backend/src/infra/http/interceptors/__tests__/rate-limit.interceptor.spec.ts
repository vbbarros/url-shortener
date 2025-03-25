import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { RateLimitInterceptor } from '../rate-limit.interceptor';
import { RateLimitService } from '../../services/rate-limit.service';

describe('RateLimitInterceptor', () => {
  let interceptor: RateLimitInterceptor;
  let rateLimitService: RateLimitService;

  const mockRateLimitService = {
    getRateLimitData: jest.fn(),
    getConfig: jest.fn(),
  };

  const mockRequest = {
    ip: '127.0.0.1',
    connection: {
      remoteAddress: '192.168.1.1',
    },
  };

  const mockResponse = {
    header: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    }),
  } as unknown as ExecutionContext;

  const mockCallHandler = {
    handle: jest.fn().mockReturnValue(of('test')),
  } as unknown as CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitInterceptor,
        {
          provide: RateLimitService,
          useValue: mockRateLimitService,
        },
      ],
    }).compile();

    interceptor = module.get<RateLimitInterceptor>(RateLimitInterceptor);
    rateLimitService = module.get<RateLimitService>(RateLimitService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should set rate limit headers using request IP', async () => {
    const mockConfig = { limit: 10, windowMs: 60000 };
    const mockRateLimitData = {
      remaining: 9,
      resetTime: Date.now() + 60000,
    };

    mockRateLimitService.getConfig.mockReturnValue(mockConfig);
    mockRateLimitService.getRateLimitData.mockReturnValue(mockRateLimitData);

    await interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise();

    expect(rateLimitService.getRateLimitData).toHaveBeenCalledWith(mockRequest.ip);
    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Limit', mockConfig.limit);
    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Remaining', mockRateLimitData.remaining);
    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Reset', new Date(mockRateLimitData.resetTime).toISOString());
  });

  it('should use connection.remoteAddress when IP is not available', async () => {
    const requestWithoutIp = {
      ...mockRequest,
      ip: undefined,
    };

    const mockContextWithoutIp = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(requestWithoutIp),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ExecutionContext;

    const mockConfig = { limit: 10, windowMs: 60000 };
    const mockRateLimitData = {
      remaining: 8,
      resetTime: Date.now() + 60000,
    };

    mockRateLimitService.getConfig.mockReturnValue(mockConfig);
    mockRateLimitService.getRateLimitData.mockReturnValue(mockRateLimitData);

    await interceptor.intercept(mockContextWithoutIp, mockCallHandler).toPromise();

    expect(rateLimitService.getRateLimitData).toHaveBeenCalledWith(requestWithoutIp.connection.remoteAddress);
    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Limit', mockConfig.limit);
    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Remaining', mockRateLimitData.remaining);
    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Reset', new Date(mockRateLimitData.resetTime).toISOString());
  });

  it('should handle the request and return the result', async () => {
    const mockConfig = { limit: 10, windowMs: 60000 };
    const mockRateLimitData = {
      remaining: 7,
      resetTime: Date.now() + 60000,
    };

    mockRateLimitService.getConfig.mockReturnValue(mockConfig);
    mockRateLimitService.getRateLimitData.mockReturnValue(mockRateLimitData);

    const result = await interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise();

    expect(result).toBe('test');
    expect(mockCallHandler.handle).toHaveBeenCalled();
  });

  it('should handle errors from RateLimitService gracefully', async () => {
    const defaultConfig = { limit: 100, windowMs: 60000 };

    mockRateLimitService.getConfig.mockReturnValue(defaultConfig);
    mockRateLimitService.getRateLimitData.mockImplementation(() => {
      throw new Error('Service error');
    });

    const result = await interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise();

    expect(result).toBe('test');
    expect(mockCallHandler.handle).toHaveBeenCalled();
    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Limit', defaultConfig.limit);
    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Remaining', 0);
    expect(mockResponse.header).toHaveBeenCalledTimes(3);
  });

  it('should set default headers when service fails completely', async () => {
    mockRateLimitService.getConfig.mockImplementation(() => {
      throw new Error('Service error');
    });
    mockRateLimitService.getRateLimitData.mockImplementation(() => {
      throw new Error('Service error');
    });

    await interceptor.intercept(mockExecutionContext, mockCallHandler).toPromise();

    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Limit', 100);
    expect(mockResponse.header).toHaveBeenCalledWith('X-RateLimit-Remaining', 0);
    expect(mockResponse.header).toHaveBeenCalledTimes(3);
    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
}); 