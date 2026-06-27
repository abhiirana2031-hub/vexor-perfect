import React, { Suspense, lazy } from 'react';
import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Outlet, useLocation } from 'react-router';

import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';

// Lazy-loaded high-fidelity pages to minimize initial bundle size
const HomePage = lazy(() => import('@/components/pages/HomePage'));
const AboutPage = lazy(() => import('@/components/pages/AboutPage'));
const ServicesPage = lazy(() => import('@/components/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('@/components/pages/ServiceDetailPage'));


const ProjectsPage = lazy(() => import('@/components/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/components/pages/ProjectDetailPage'));
const ContactPage = lazy(() => import('@/components/pages/ContactPage'));
const AdminDashboardPage = lazy(() => import('@/components/pages/AdminDashboardPage'));
const TeamMemberDetailPage = lazy(() => import('@/components/pages/TeamMemberDetailPage'));
const UserProfilePage = lazy(() => import('@/components/pages/UserProfilePage'));
const BlogsPage = lazy(() => import('@/components/pages/BlogsPage'));
const BlogDetailPage = lazy(() => import('@/components/pages/BlogDetailPage'));

// Premium loader matching Vexor's new dark cinematic aesthetic
function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute w-24 h-24 rounded-full bg-white/5 blur-xl animate-pulse" />
        
        {/* Sleek rotating ring */}
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-white animate-spin" />
        
        {/* Innermost pulsing logo-dot */}
        <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-ping" />
      </div>
      <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.25em] text-white/40 animate-pulse">
        Optimizing experience...
      </p>
    </div>
  );
}

// Layout component that includes ScrollToTop and seamless page transitions
function Layout() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.97, rotateX: 3, transformPerspective: 1200 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, transformPerspective: 1200 }}
          exit={{ opacity: 0, scale: 1.03, rotateX: -3, transformPerspective: 1200 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'top center' }}
          className="w-full"
        >
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </motion.div>
      </AnimatePresence>
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
        path: "team/:id",
        element: <TeamMemberDetailPage />,
        routeMetadata: {
          pageIdentifier: 'team-member-detail',
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
    <ErrorBoundary>
      <MemberProvider>
        <RouterProvider router={router} />
      </MemberProvider>
    </ErrorBoundary>
  );
}
