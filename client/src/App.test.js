import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation for recipe app', () => {
  render(<App />);
  expect(screen.getByText(/כל המתכונים/)).toBeInTheDocument();
});
