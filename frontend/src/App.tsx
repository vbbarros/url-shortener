import { ThemeProvider } from 'styled-components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { URLShortener } from './components/URLShortener';
import { Login } from './components/Auth/Login';
import { SignUp } from './components/Auth/SignUp';
import { GlobalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import styled from 'styled-components';

const AppContainer = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 600px;
`;

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GlobalStyles />
          <AppContainer>
            <ContentWrapper>
              <Routes>
                <Route path="/" element={<URLShortener />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </ContentWrapper>
          </AppContainer>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
