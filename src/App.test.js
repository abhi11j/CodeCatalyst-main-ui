import { render, screen } from '@testing-library/react';
import App from './App';

test('renders project improvement hub', () => {
  render(<App />);
  const headingElement = screen.getByText(/project improvement hub/i);
  expect(headingElement).toBeInTheDocument();
});
