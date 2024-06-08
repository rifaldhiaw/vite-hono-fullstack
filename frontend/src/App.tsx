import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";

import reactLogo from "./assets/react.svg";
import { trpc } from "./utils/trpc";
import viteLogo from "/vite.svg";

import "./App.css";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: import.meta.env.VITE_API_URL + "/api/trpc",
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Home() {
  const [count, setCount] = useState(0);

  const handleFetchHello = async () => {
    const res = await fetch("/api/hello");
    const json = await res.json();
    alert(json.hello);
  };

  const trpcUser = trpc.user.get.useQuery({
    id: "1",
    name: "John Doe",
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <button onClick={handleFetchHello}>Fetch Hello</button>
      </div>

      {trpcUser.data ? (
        <p>
          tRPC User: {trpcUser.data.id} - {trpcUser.data.name}
        </p>
      ) : null}

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
