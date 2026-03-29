import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import AboutPage from '@/components/pages/AboutPage';
import ServicesPage from '@/components/pages/ServicesPage';
import ServiceDetailPage from '@/components/pages/ServiceDetailPage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import ProjectDetailPage from '@/components/pages/ProjectDetailPage';
import ContactPage from '@/components/pages/ContactPage';
import AdminDashboardPage from '@/components/pages/AdminDashboardPage';
import TeamMemberDetailPage from '@/components/pages/TeamMemberDetailPage';
import UserProfilePage from '@/components/pages/UserProfilePage';
import BlogsPage from '@/components/pages/BlogsPage';
import BlogDetailPage from '@/components/pages/BlogDetailPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "about",
        element: <AboutPage />,
        routeMetadata: {
          pageIdentifier: 'about',
        },
      },
      {
        path: "services",
        element: <ServicesPage />,
        routeMetadata: {
          pageIdentifier: 'services',
        },
      },
      {
        path: "services/:id",
        element: <ServiceDetailPage />,
        routeMetadata: {
          pageIdentifier: 'service-detail',
        },
      },
      {
        path: "projects",
        element: <ProjectsPage />,
        routeMetadata: {
          pageIdentifier: 'projects',
        },
      },
      {
        path: "projects/:id",
        element: <ProjectDetailPage />,
        routeMetadata: {
          pageIdentifier: 'project-detail',
        },
      },
      {
        path: "contact",
        element: <ContactPage />,
        routeMetadata: {
          pageIdentifier: 'contact',
        },
      },
      {
        path: "admin",
        element: <AdminDashboardPage />,
        routeMetadata: {
          pageIdentifier: 'admin',
        },
      },
      {
        path: "blogs",
        element: <BlogsPage />,
        routeMetadata: {
          pageIdentifier: 'blogs',
        },
      },
      {
        path: "blogs/:id",
        element: <BlogDetailPage />,
        routeMetadata: {
          pageIdentifier: 'blog-detail',
        },
      },
      {
        path: "profile",
        element: <UserProfilePage />,
        routeMetadata: {
          pageIdentifier: 'profile',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
