"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
      <ToastContainer />
    </QueryClientProvider>
  );
}

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAnswer = async (question: string) => {
  const response = await fetch(`${url}/get-answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

function HomeContent() {
  const { mutate, isLoading, data } = useMutation(getAnswer, {
    onSuccess: () => {
      toast("Answer ready!", { type: "success" });
    },
    onError: () => {
      toast("There was an error", { type: "error" });
    },
  });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("bielmorales93@gmail.com");
      toast("Email copied successfully!", { type: "success" });
    } catch (error) {
      toast("Failed to copy email.", { type: "error" });
    }
  };

  const [question, setQuestion] = useState<string>("");
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-800 text-white py-4">
        <div className="flex justify-between items-center px-4 sm:px-8">
          <div className="text-sm sm:text-base">Gabriel dos Reis Morales</div>
          <div>
            <button
              onClick={handleCopyEmail}
              className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 bg-blue-800 rounded hover:bg-blue-900"
            >
              Email
            </button>
            <a
              href="https://calendly.com/bielmorales93"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 bg-blue-800 rounded hover:bg-blue-900">
                Book a call
              </button>
            </a>
            <a href="/resume.pdf" download>
              <button className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 bg-blue-800 rounded hover:bg-blue-900">
                Resume
              </button>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-2 sm:p-4 bg-main-background">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 max-w-full sm:max-w-lg w-full">
          <h1 className="text-lg sm:text-xl font-bold text-blue-900 mb-4">
            What do you want to know about my professional experience?
          </h1>
          <input
            type="text"
            placeholder="Eg: Do you have experience working with Next.js?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="form-input w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-900 focus:border-blue-800 rounded-md mb-4"
          />
          <button
            onClick={() => mutate(question)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-800 text-white rounded-md hover:bg-blue-900 w-full"
          >
            {isLoading ? "Loading..." : "Get Answer"}
          </button>
          <div className="mt-4 h-32 overflow-y-auto">{data?.answer}</div>
        </div>
      </main>
    </div>
  );
}
