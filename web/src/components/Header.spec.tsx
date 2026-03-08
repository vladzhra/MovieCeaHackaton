import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Mock the AuthContext hooks if needed, or wrap in AuthProvider
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: { email: 'test@example.com', isAdmin: false },
      logout: vi.fn(),
      isAdmin: false,
    }),
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Header Component', () => {
  const mockProps = {
    searchInput: '',
    onSearchChange: vi.fn(),
    onSearchSubmit: vi.fn(),
  };

  it('renders logo and search input', () => {
    render(
      <BrowserRouter>
        <Header {...mockProps} />
      </BrowserRouter>
    );

    // Using getByText with a specific selector to disambiguate
    expect(screen.getByText(/Movie/, { selector: 'h6' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Discover your next favorite film…/i)).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in search input', () => {
    render(
      <BrowserRouter>
        <Header {...mockProps} />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Discover your next favorite film…/i);
    fireEvent.change(input, { target: { value: 'Inception' } });

    expect(mockProps.onSearchChange).toHaveBeenCalledWith('Inception');
  });

  it('navigates to home when logo is clicked', () => {
    render(
      <BrowserRouter>
        <Header {...mockProps} />
      </BrowserRouter>
    );

    // Find the logo container by finding the MovieIcon and going up
    const logoIcon = screen.getByTestId('MovieIcon');
    fireEvent.click(logoIcon);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
