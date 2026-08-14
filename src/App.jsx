import { Route, Routes } from "react-router";
import { useEffect } from "react";

import { deleteExpiredTrashPhotos } from "./libs/photoDB";

import useAuthBootstrap from './hooks/auth/useAuthBootstrap';
import useAuthStore from './store/useAuthStore';

import SplashPage from "./pages/SplashPage";

import ProtectedRoute from "./components/auth/ProtectRoute";

import CameraPage from "./pages/CameraPage";
import HomePage from "./pages/HomePage";
import TournamentPage from "./pages/TournamentPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AlbumPage from './pages/AlbumPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import BestPickDetailPage from "./pages/BestPickDetailPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import MyPage from "./pages/mypage/MyPage";
import ProfileEditPage from "./pages/mypage/ProfileEditPage";
import TermsPage from './pages/mypage/TermsPage';
import MyPasswordResetPage from './pages/mypage/MyPasswordResetPage';
import TrashPage from './pages/TrashPage';
import GalleryImportPage from './pages/mypage/GalleryImportPage';

const App = () => {
  useAuthBootstrap(); ///users/me 결과를 Zustand의 useAuthStore에 저장

  const authStatus = useAuthStore(
    (state) => state.authStatus,
  ); //Zustand 안에 있는 authStatus 값을 꺼내옴

  useEffect(() => {
    const cleanExpiredTrash = async () => {
      try {
        const deletedCount = await deleteExpiredTrashPhotos();

        if (deletedCount > 0) {
          console.log(`${deletedCount}장의 만료된 휴지통 사진을 영구 삭제했습니다.`);
        }
      } catch (error) {
        console.error('만료된 휴지통 사진 삭제 실패:',error);
      }
    };

    cleanExpiredTrash();
  }, []);

  return (
    <main className="min-h-dvh">
      <div className="mx-auto min-h-dvh w-full max-w-md bg-background">
          {authStatus === 'checking' ? (
            <SplashPage />
          ) : (
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route 
                  path="/" 
                  element={<HomePage />} 
                />
                <Route 
                  path="/camera" 
                  element={<CameraPage />} 
                />
                <Route
                  path="/tournament/:sessionId" //:는 변수라는 뜻
                  element={<TournamentPage />}
                />
                <Route
                  path="/category" 
                  element={<CategoryPage />}
                />
                
                <Route
                  path="/album"
                  element={<AlbumPage />}
                />
                <Route
                  path="/album/:categoryId"
                  element={<AlbumDetailPage />}
                />
                <Route
                  path="/album/photo/:bestPickId"
                  element={<BestPickDetailPage />}
                />
                <Route
                  path="/mypage"
                  element={<MyPage />}
                />
                <Route
                  path="/mypage/edit"
                  element={<ProfileEditPage />}
                />
                <Route
                  path="/terms"
                  element={<TermsPage />}
                />
                <Route
                  path="/mypage/password-reset"
                  element={<MyPasswordResetPage />}
                />
                <Route
                  path="/album/trash"
                  element={<TrashPage />}
                />
                <Route
                  path="/mypage/import"
                  element={<GalleryImportPage />}
                />
              </Route>
      
              <Route
                path="/login"
                element={<LoginPage />}
              />
              <Route
                path="/signup"
                element={<SignupPage />}
              />
              <Route
                path="/password-reset"
                element={<PasswordResetPage />}
              />
            </Routes>
          )}
      </div>
    </main>
    
  )
}

export default App
