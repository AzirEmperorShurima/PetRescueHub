import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import LoadingScreen from "../components/common/display/LoadingScreen";
import ProtectedRoute from "../components/guards/ProtectedRoute";

// Lazy-load toàn bộ pages/features
const Login = lazy(() => import("../features/Auth/Login"));
const Register = lazy(() => import("../features/Auth/Register"));
const ForgotPassword = lazy(() => import("../features/Auth/ForgotPassword"));

const Rescue = lazy(() => import("../pages/Rescue/Rescue"));
const RescueSuccess = lazy(() => import("../pages/Rescue/RescueSuccess"));

const Home = lazy(() => import("../pages/Home/Home"));

const Forum = lazy(() => import("../pages/Forum/Forum"));
const PostDetail = lazy(() => import("../features/Forum/PostDetail"));
const QuestionDetail = lazy(() => import("../features/Forum/QuestionDetail"));
const CreatePost = lazy(() => import("../features/Forum/CreatePost"));
const CreateQuestion = lazy(() => import("../features/Forum/CreateQuestion"));

const Event = lazy(() => import("../pages/Event/Event"));
const CreateEvent = lazy(() => import("../features/Event/CreateEvent"));
const EventDetail = lazy(() => import("../features/Event/EventDetail"));

const FindHome = lazy(() => import("../pages/Adopt/FindHome"));
const Adopt = lazy(() => import("../pages/Adopt/Adopt"));

const Donate = lazy(() => import("../pages/Donate/Donate"));
const PetGuide = lazy(() => import("../pages/PetGuide/PetGuide"));

const Profile = lazy(() => import("../pages/Profile/Profile"));

// const Chatbot = lazy(() => import("../services/Chatbot.service.js"));

const NotFound = lazy(() => import("../components/common/Error/NotFound"));

const AdminApp = lazy(() => import("../pages/admin/AdminApp"));

const Terms = lazy(() => import("../pages/Terms/Terms"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Main site với MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          
          {/* Adopt, Donate */}
          <Route path="findhome" element={<FindHome />} />
          <Route path="adopt" element={<Adopt />} />
          <Route path="donate" element={<Donate />} />
          
          {/* Forum public */}
          <Route path="forum">
            <Route index element={<Forum />} />
            <Route path="post/:id" element={<PostDetail />} />
            <Route path="question/:id" element={<QuestionDetail />} />
          </Route>
          
          {/* Event public */}
          <Route path="event">
            <Route index element={<Event />} />
            <Route path=":id" element={<EventDetail />} />
          </Route>
          
          {/* Auth public */}
          <Route path="auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          
          <Route path="terms" element={<Terms />} />
          <Route path="rescue" element={<Rescue />} />
          <Route path="rescue/success" element={<RescueSuccess />} />
          {/* <Route path="chatbot" element={<Chatbot />} /> */}
          
          {/* Pet Guide */}
          <Route path="petguide" element={<PetGuide />} />

          {/* Các route bảo vệ */}
          <Route element={<ProtectedRoute />}>
            <Route path="forum/post/create" element={<CreatePost />} />
            <Route path="forum/question/create" element={<CreateQuestion />} />
            <Route path="event/create" element={<CreateEvent />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin area với AdminLayout */}
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;