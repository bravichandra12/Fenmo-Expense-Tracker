import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import List from './List';

const mockExpenses = [
  { id: 1, amount: '50.00', category: 'Food', description: 'Lunch', expense_date: '2023-10-01' },
  { id: 2, amount: '20.00', category: 'Transport', description: 'Bus', expense_date: '2023-10-02' }
];

const mockCategoryOptions = ['Food', 'Transport', 'Bills'];

const renderList = (props = {}) => {
  return render(
    <List
      expenses={mockExpenses}
      total={70}
      categoryTotals={[]}
      loading={false}
      error={''}
      filterCategory={''}
      setFilterCategory={() => {}}
      CATEGORY_OPTIONS={mockCategoryOptions}
      {...props}
    />
  );
};

test('renders expense tracker heading', () => {
  renderList();
  const headingElement = screen.getByText(/Expense Tracker/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders expense rows correctly', () => {
  renderList();
  expect(screen.getByText('Lunch')).toBeInTheDocument();
  expect(screen.getByText('Bus')).toBeInTheDocument();
  expect(screen.getByText('₹50.00')).toBeInTheDocument();
  expect(screen.getByText('₹20.00')).toBeInTheDocument();
});

test('displays loading state', () => {
  renderList({ loading: true });
  expect(screen.getByText(/Loading expenses.../i)).toBeInTheDocument();
});

test('displays error state with retry button', () => {
  const onRetryMock = jest.fn();
  renderList({ error: 'Network error', onRetry: onRetryMock });
  
  expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
});
