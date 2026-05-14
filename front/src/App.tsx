import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const MockPage = ({ title }: { title: string }) => (
  <div className='flex items-center justify-center h-64'>
    <div className='text-center'>
      <h2 className='text-2xl font-bold text-dark-800 mb-2'>{title}</h2>
      <p className='text-gray-400'>Em breve...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Navigate to='/dashboard' replace />} />
            <Route path='dashboard' element={<DashboardPage />} />
            <Route path='transactions' element={<TransactionsPage />} />
            <Route path='history' element={<HistoryPage />} />
            <Route path='cards' element={<MockPage title='My Cards' />} />
            <Route path='invest' element={<MockPage title='Investments' />} />
            <Route path='analytics' element={<MockPage title='Analytics' />} />
            <Route path='profile' element={<ProfilePage />} />
          </Route>
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}