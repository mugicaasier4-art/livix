import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { MessagingProvider } from "@/contexts/MessagingContext";
import { ApplicationsProvider } from "@/contexts/ApplicationsContext";
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider";
import { NotificationPreferencesProvider } from "@/contexts/NotificationPreferencesContext";
import { LikesProvider } from "@/contexts/LikesContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";

// Eager loaded - critical path pages
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Lazy loaded - non-critical pages
const Bookings = lazy(() => import("./pages/Bookings"));
const Messages = lazy(() => import("./pages/Messages"));
const Applications = lazy(() => import("./pages/landlord/Applications"));
const Landlords = lazy(() => import("./pages/Landlords"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Residences = lazy(() => import("./pages/Residences"));
const ResidencesDirectory = lazy(() => import("./pages/residences/Directory"));
const ResidenceDetail = lazy(() => import("./pages/residences/ResidenceDetail"));
const RoommatesFrontpage = lazy(() => import("./pages/RoommatesFrontpage"));
const RoommatesApp = lazy(() => import("./pages/Roommates"));
const RoomListingDetail = lazy(() => import("./pages/RoomListingDetail"));
const CreateRoomListing = lazy(() => import("./pages/CreateRoomListing"));
const EditRoomListing = lazy(() => import("./pages/EditRoomListing"));
const Club = lazy(() => import("./pages/Club"));
const ClubSector = lazy(() => import("./pages/ClubSector"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Erasmus = lazy(() => import("./pages/Erasmus"));
const ErasmusGuide = lazy(() => import("./pages/erasmus/Guide"));
const ErasmusHousing = lazy(() => import("./pages/erasmus/Housing"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const LandlordDashboard = lazy(() => import("./pages/landlord/Dashboard"));
const LandlordOnboarding = lazy(() => import("./pages/landlord/Onboarding"));
const CreateListing = lazy(() => import("./pages/landlord/CreateListing"));
const StudentOnboarding = lazy(() => import("./pages/student/Onboarding"));
const StudentDashboard = lazy(() => import("./pages/student/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Support = lazy(() => import("./pages/Support"));
const SupportSubmit = lazy(() => import("./pages/support/Submit"));
const SupportSuccess = lazy(() => import("./pages/support/Success"));
const LegalTerms = lazy(() => import("./pages/legal/Terms"));
const LegalPrivacy = lazy(() => import("./pages/legal/Privacy"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const LandlordSettings = lazy(() => import("./pages/landlord/Settings"));
const LandlordListings = lazy(() => import("./pages/landlord/Listings"));
const EditListing = lazy(() => import("./pages/landlord/EditListing"));
const Analytics = lazy(() => import("./pages/landlord/Analytics"));

// Secret premium dashboard for residences
const ResidencesAdminPortal = lazy(() => import("./pages/residences/AdminPortal"));

// QueryClient singleton - created once outside component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Loading fallback for lazy components
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <LikesProvider>
          <NotificationPreferencesProvider>
            <BookingProvider>
              <MessagingProvider>
                <ApplicationsProvider>
                  <TooltipProvider>
                    <Sonner />
                    <BrowserRouter>
                      <ScrollToTop />
                      <OnboardingProvider>
                        <CompareProvider>
                          <PreferencesProvider>
                            <Suspense fallback={<PageLoader />}>
                              <Routes>
                                {/* Public Routes - Eager Loaded */}
                                <Route path="/" element={<Index />} />
                                <Route path="/explore" element={<Explore />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />

                                {/* Public Routes - Lazy Loaded */}
                                <Route path="/listing/:id" element={<ListingDetail />} />
                                <Route path="/how-it-works" element={<HowItWorks />} />
                                <Route path="/residences" element={<Residences />} />
                                <Route path="/residences/directory" element={<ResidencesDirectory />} />
                                <Route path="/residences/:id" element={<ResidenceDetail />} />
                                <Route path="/roommates" element={<RoommatesFrontpage />} />
                                <Route path="/roommates/app" element={<RoommatesApp />} />
                                <Route path="/roommates/listing/:id" element={<RoomListingDetail />} />
                                <Route path="/matches" element={<RoommatesApp />} />
                                <Route path="/club" element={<Club />} />
                                <Route path="/club/:sectorId" element={<ClubSector />} />
                                <Route path="/blog" element={<Blog />} />
                                <Route path="/blog/:id" element={<BlogPost />} />
                                <Route path="/erasmus" element={<Erasmus />} />
                                <Route path="/erasmus/guide" element={<ErasmusGuide />} />
                                <Route path="/erasmus/housing" element={<ErasmusHousing />} />
                                <Route path="/landlords" element={<Landlords />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password" element={<ResetPassword />} />
                                <Route path="/unauthorized" element={<Unauthorized />} />
                                <Route path="/support" element={<Support />} />
                                <Route path="/support/submit" element={<SupportSubmit />} />
                                <Route path="/support/success" element={<SupportSuccess />} />
                                <Route path="/legal/terms" element={<LegalTerms />} />
                                <Route path="/legal/privacy" element={<LegalPrivacy />} />

                                {/* Secret Premium Dashboard for Residences */}
                                <Route path="/residences/admin-portal-x7k9" element={<ResidencesAdminPortal />} />

                                {/* Protected Routes - Roommates */}
                                <Route path="/roommates/create" element={
                                  <ProtectedRoute>
                                    <CreateRoomListing />
                                  </ProtectedRoute>
                                } />
                                <Route path="/roommates/edit/:id" element={
                                  <ProtectedRoute>
                                    <EditRoomListing />
                                  </ProtectedRoute>
                                } />

                                {/* Protected Routes - Bookings & Messages */}
                                <Route path="/bookings" element={
                                  <ProtectedRoute>
                                    <Bookings />
                                  </ProtectedRoute>
                                } />
                                <Route path="/messages" element={
                                  <ProtectedRoute>
                                    <Messages />
                                  </ProtectedRoute>
                                } />
                                <Route path="/messages/:threadId" element={
                                  <ProtectedRoute>
                                    <Messages />
                                  </ProtectedRoute>
                                } />

                                {/* Protected Routes - User */}
                                <Route path="/favorites" element={
                                  <ProtectedRoute>
                                    <Favorites />
                                  </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                                  <ProtectedRoute>
                                    <Profile />
                                  </ProtectedRoute>
                                } />
                                <Route path="/settings" element={
                                  <ProtectedRoute>
                                    <Settings />
                                  </ProtectedRoute>
                                } />

                                {/* Protected Routes - Landlord */}
                                <Route path="/ll/dashboard" element={
                                  <ProtectedRoute allowedRoles={['landlord']}>
                                    <LandlordDashboard />
                                  </ProtectedRoute>
                                } />
                                <Route path="/ll/onboarding" element={
                                  <ProtectedRoute allowedRoles={['landlord']}>
                                    <LandlordOnboarding />
                                  </ProtectedRoute>
                                } />
                                <Route path="/ll/create-listing" element={
                                  <ProtectedRoute allowedRoles={['landlord']}>
                                    <CreateListing />
                                  </ProtectedRoute>
                                } />
                                <Route path="/ll/settings" element={
                                  <ProtectedRoute allowedRoles={['landlord']}>
                                    <LandlordSettings />
                                  </ProtectedRoute>
                                } />
                                <Route path="/ll/listings" element={
                                  <ProtectedRoute allowedRoles={['landlord']}>
                                    <LandlordListings />
                                  </ProtectedRoute>
                                } />
                                <Route path="/ll/edit-listing/:id" element={
                                  <ProtectedRoute allowedRoles={['landlord']}>
                                    <EditListing />
                                  </ProtectedRoute>
                                } />
                                <Route path="/ll/analytics" element={
                                  <ProtectedRoute allowedRoles={['landlord']}>
                                    <Analytics />
                                  </ProtectedRoute>
                                } />
                                <Route path="/ll/applications" element={
                                  <ProtectedRoute allowedRoles={['landlord']}>
                                    <Applications />
                                  </ProtectedRoute>
                                } />
                                <Route path="/ll/applications/:applicationId" element={
                                  <ProtectedRoute allowedRoles={['landlord']}>
                                    <Applications />
                                  </ProtectedRoute>
                                } />

                                {/* Protected Routes - Student */}
                                <Route path="/student/dashboard" element={
                                  <ProtectedRoute allowedRoles={['student']}>
                                    <StudentDashboard />
                                  </ProtectedRoute>
                                } />
                                <Route path="/onboarding/student" element={
                                  <ProtectedRoute allowedRoles={['student']}>
                                    <StudentOnboarding />
                                  </ProtectedRoute>
                                } />

                                {/* Protected Routes - Admin */}
                                <Route path="/admin/dashboard" element={
                                  <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminDashboard />
                                  </ProtectedRoute>
                                } />

                                {/* 404 - Must be last */}
                                <Route path="/404" element={<NotFound />} />
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </Suspense>
                          </PreferencesProvider>
                        </CompareProvider>
                      </OnboardingProvider>
                    </BrowserRouter>
                  </TooltipProvider>
                </ApplicationsProvider>
              </MessagingProvider>
            </BookingProvider>
          </NotificationPreferencesProvider>
        </LikesProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
