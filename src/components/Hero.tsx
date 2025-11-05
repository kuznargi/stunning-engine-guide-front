import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Hero = () => {
  const words = ["Найдём за 10 секунд", "Покажем скрытые места", "Построим идеальный маршрут"];
  const [currentWord, setCurrentWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const word = words[wordIndex];
    const typingSpeed = isDeleting ? 100 : 100;
    const pauseTime = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && currentWord === word) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && currentWord === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else {
        setCurrentWord(
          isDeleting
            ? word.substring(0, currentWord.length - 1)
            : word.substring(0, currentWord.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, wordIndex, words]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#00D9FF] opacity-20 blur-[100px] rounded-full -top-48 -left-48 animate-float"></div>
        <div className="absolute w-96 h-96 bg-[#6366F1] opacity-20 blur-[100px] rounded-full -bottom-48 -right-48 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-[#F8FAFC] leading-tight">
       Не знаешь, куда пойти?<br />
          {" "}
          <span className="gradient-text relative inline-block">
            {currentWord}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto">
          ИИ-гид по всему Казахстану: 1–3 места рядом с маршрутом и «что делать?»
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
         <Link to="/dashboard">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#6366F1] to-[#00D9FF] text-white font-semibold px-8 py-6 text-lg hover:shadow-lg hover:shadow-[#00D9FF]/50 transition-all duration-300 border-0"
          >Открыть платформу
          </Button>
        </Link>
        </div>

        {/* Floating holographic effect */}
        <div className="absolute -z-10 w-64 h-64 bg-gradient-to-r from-[#00D9FF]/20 to-[#6366F1]/20 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#00D9FF]/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#00D9FF] rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
