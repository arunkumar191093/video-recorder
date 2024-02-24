import './App.css';
import { Home } from './pages/home';

function App() {
  return (
    <div>
      <div className='px-6 py-2 bg-blue-700 text-white font-extrabold text-lg'>Video Recorder</div>
      <div className="p-6">
        <Home />
      </div>
    </div>
  );
}

export default App;
