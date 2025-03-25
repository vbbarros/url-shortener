export interface IError {
  message: string;
  code: string;
}

export class InvalidCredentialsError implements IError {
  message = 'Invalid credentials';
  code = 'INVALID_CREDENTIALS';
}

export class UserNotFoundError implements IError {
  message = 'User not found';
  code = 'USER_NOT_FOUND';
}

export class UrlNotFoundError implements IError {
  message = 'URL not found';
  code = 'URL_NOT_FOUND';
}

export class EmailAlreadyExistsError implements IError {
  message = 'Email already exists';
  code = 'EMAIL_ALREADY_EXISTS';
}

export class SlugAlreadyExistsError implements IError {
  message = 'Slug already exists';
  code = 'SLUG_ALREADY_EXISTS';
} 