import { createBrowserRouter } from 'react-router-dom';

import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProducersPage } from '../pages/producers/ProducersPage';

export const router = createBrowserRouter([
  { path: '/', element: <DashboardPage /> },
  { path: '/producers', element: <ProducersPage /> },
]);
