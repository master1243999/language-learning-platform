"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  order: number;
}

export default function FlashcardsPage() {
  const { id } = useParams<{ id: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch(`/api/topics/${id}`);
        const data = await response.json();
        setFlashcards(data.flashcards);
      } catch (error) {
        console.error("获取闪卡失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [id]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载闪卡中...</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">未找到闪卡</h2>
          <button 
            onClick={() => router.back()}
            className="mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            返回主题
          </button>
        </div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-emerald-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => router.back()}
          className="text-emerald-600 hover:text-emerald-800 mb-4 flex items-center"
        >
          ← 返回主题
        </button>
        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">闪卡</h1>
            <p className="text-gray-600">{currentIndex + 1} / {flashcards.length}</p>
          </div>
          
          <div className="w-full max-w-md">
            <div 
              className={`relative h-96 w-full perspective cursor-pointer`}
              onClick={toggleFlip}
            >
              <div 
                className={`absolute w-full h-full transition-transform duration-500 transform ${flipped ? 'rotate-y-180' : ''} preserve-3d`}
              >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
                  <h2 className="text-2xl font-semibold text-gray-800 text-center">{currentFlashcard.front}</h2>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full backface-hidden bg-emerald-50 rounded-lg shadow-md p-8 flex items-center justify-center rotate-y-180">
                  <h2 className="text-2xl font-semibold text-gray-800 text-center">{currentFlashcard.back}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full max-w-md mt-8">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center px-4 py-2 rounded-lg ${currentIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-800'}`}
            >
              <ArrowLeft size={16} className="mr-2" />
              上一张
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className={`flex items-center px-4 py-2 rounded-lg ${currentIndex === flashcards.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-800'}`}
            >
              下一张
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
}