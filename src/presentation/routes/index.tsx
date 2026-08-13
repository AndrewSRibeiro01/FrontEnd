import { createBrowserRouter, Outlet } from 'react-router-dom';

import { AppLayout } from '../components/organisms/AppLayout';
import { NotificationsProvider } from '../notifications/notifications-context';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { FarmDetailsPage } from '../pages/farms/FarmDetailsPage';
import { ProducerDetailsPage } from '../pages/producers/ProducerDetailsPage';
import { ProducersPage } from '../pages/producers/ProducersPage';

function Layout() {
  return (
    <NotificationsProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </NotificationsProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/producers', element: <ProducersPage /> },
      { path: '/producers/:producerId', element: <ProducerDetailsPage /> },
      { path: '/farms/:farmId', element: <FarmDetailsPage /> },
    ],
  },
]);
