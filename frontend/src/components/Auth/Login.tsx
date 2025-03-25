import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../Button';
import { Input } from '../Input';
import * as S from './styles';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await signIn(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleContinueWithoutAccount = () => {
    navigate('/');
  };

  return (
    <S.Container>
      <S.Title>Welcome Back</S.Title>
      {error && <S.Error>{error}</S.Error>}
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" isLoading={isSubmitting}>
          Sign In
        </Button>
      </S.Form>
      <S.Divider>or</S.Divider>
      <Button 
        onClick={handleContinueWithoutAccount}
        variant="success"
        type="button"
        style={{ width: '100%' }}
      >
        Continue Without Account
      </Button>
      <S.Footer>
        Don't have an account?{' '}
        <Link to="/signup">Sign Up</Link>
      </S.Footer>
    </S.Container>
  );
} 