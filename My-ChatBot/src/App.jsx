import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

import LoginRegister from '../pages/LoginRegister';
import Chat from '../pages/Chat';
import MoodLogger from '../pages/MoodLog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/LoginRegister" element={<LoginRegister/>}/>
       <Route path="/Chat" element={<Chat />} />
        <Route path="/MoodLog" element={<MoodLogger userId={1} />} />
      </Routes>
    </Router>
  );
}

export default App;
