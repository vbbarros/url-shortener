import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../Button';
import * as S from './styles';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/login');
    }
  };

  return (
    <S.Container>
      <S.Logo>URL Shortener</S.Logo>
      {user ? (
        <S.UserInfo>
          <span>Welcome, {user.name}!</span>
          <Button onClick={handleAuthClick} variant="success" type="button" size="small">
            Sign Out
          </Button>
        </S.UserInfo>
      ) : (
        <S.UserInfo>
          <Button onClick={handleAuthClick} variant="primary" type="button" size="small">
            Sign In
          </Button>
        </S.UserInfo>
      )}
    </S.Container>
  );
} 