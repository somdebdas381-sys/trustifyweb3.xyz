import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Trustify logo text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Trustify/i);
  expect(linkElement).toBeInTheDocument();
});
