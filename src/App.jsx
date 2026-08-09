import { Route, Routes } from "react-router";
import { useEffect } from "react";

import { deleteExpiredTrashPhotos } from "./libs/photoDB";

import CameraPage from "./pages/CameraPage";
import HomePage from "./pages/HomePage";
import TournamentPage from "./pages/TournamentPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AlbumPage from './pages/AlbumPage';
import AlbumDetailPage from './pages/AlbumDetailPage';

const App = () => {
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
        <Routes>
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
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/signup"
            element={<SignupPage />}
          />
          <Route
            path="/album"
            element={<AlbumPage />}
          />
          <Route
            path="/album/:categoryId"
            element={<AlbumDetailPage />}
          />
        </Routes>
      </div>
    </main>
    
  )
}

export default App