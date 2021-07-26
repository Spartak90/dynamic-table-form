import { QueryClient, QueryClientProvider } from 'react-query';

import './App.css';
import TilesPage from './pages/TilesPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <TilesPage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
