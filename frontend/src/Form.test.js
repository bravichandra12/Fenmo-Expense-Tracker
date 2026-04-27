import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from './Form';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}), { virtual: true });

const mockCategoryOptions = ['Food', 'Transport', 'Bills'];

const renderForm = (onAddMock = jest.fn()) => {
  return render(
    <Form onAdd={onAddMock} CATEGORY_OPTIONS={mockCategoryOptions} />
  );
};

test('renders form inputs correctly', () => {
  renderForm();
  expect(screen.getByPlaceholderText('Amount (₹)')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add Expense/i })).toBeInTheDocument();
});

test('shows error when submitting empty form', () => {
  renderForm();
  const submitButton = screen.getByRole('button', { name: /Add Expense/i });
  fireEvent.click(submitButton);
  
  expect(screen.getByText(/Amount, category, and date are required/i)).toBeInTheDocument();
});

test('shows error for negative amounts', () => {
  renderForm();
  
  fireEvent.change(screen.getByPlaceholderText('Amount (₹)'), { target: { value: '-50' } });
  
  // The select doesn't have a label explicitly tied via htmlFor in the DOM, so we can find it by display value
  const categorySelect = screen.getByDisplayValue('Select Category');
  fireEvent.change(categorySelect, { target: { value: 'Food' } });
  
  // Date input doesn't have a placeholder, but we can find it by type
  const dateInput = document.querySelector('input[type="date"]');
  fireEvent.change(dateInput, { target: { value: '2023-10-01' } });
  
  fireEvent.click(screen.getByRole('button', { name: /Add Expense/i }));
  
  expect(screen.getByText(/Amount must be a positive number/i)).toBeInTheDocument();
});
