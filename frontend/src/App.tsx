import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import Test from './pages/Test';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />

      <Route path="/test" element={<Test />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
