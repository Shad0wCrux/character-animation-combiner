import Home from "./pages/Home.jsx";
import { Provider as ModelProvider } from "./context/ModelContext.jsx";

export default function App() {
  return (
    <ModelProvider>
      <Home />
    </ModelProvider>
  );
}
