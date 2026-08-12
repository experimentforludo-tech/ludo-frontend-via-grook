import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameArea from './pages/GameArea';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center h-full w-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:roomId" element={<GameArea />} />
      </Routes>
    </div>
  );
}