import { Zap, Leaf, Shield } from "lucide-react";

const Solution = () => {
  const features = [
    {
      icon: Zap,
      title: "1-3 места рядом за 5 сек",
      description: "ИИ анализирует твою локацию, время и предпочтения → выдаёт готовые варианты с расстоянием ",
    },
    {
      icon: Leaf,
      title: "Мгновенный фильтр по тегам + расстоянию",
      description: "RAG ищет только в радиусе пешком, учитывает «кофе», «розетка», «дети»",
    },
    {
      icon: Shield,
      title: "Проверка времени работы + точный путь",
      description: "Система берёт данные POI, считает реальное время пешком.",
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center text-[#F8FAFC] mb-8 animate-fade-in">
          РЕШЕНИЕ
        </h2>

        <p className="text-lg text-[#94A3B8] text-center max-w-3xl mx-auto mb-16">
          Я объединила базу всех интересных мест Астаны с искусственным интеллектом, который понимает твой запрос и контекст. Скажи где ты и что хочешь — получи 3 конкретных места с маршрутом, временем и объяснением, почему они идеальны именно для тебя прямо сейчас.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass glass-hover rounded-2xl p-8 text-center transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#10B981]/20 to-[#00D9FF]/20 flex items-center justify-center mb-6 glow-emerald">
                <feature.icon size={40} className="text-[#10B981]" />
              </div>

              <h3 className="text-2xl font-heading font-semibold text-[#F8FAFC] mb-4">
                {feature.title}
              </h3>

              <p className="text-[#94A3B8]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mockup placeholder with glow effect */}
<div
  className="mt-16 glass rounded-3xl p-8 animate-fade-in-up"
  style={{ animationDelay: '0.6s' }}
>
  <div className="aspect-video rounded-2xl overflow-hidden border border-[#00D9FF]/30 glow-cyan">
    <iframe
      className="w-full h-full"
      src="https://www.youtube.com/embed/NHTCrgbgdlc?autoplay=1&mute=1&loop=1&playlist=NHTCrgbgdlc"
      title="AI Dashboard Preview"
      frameBorder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
</div>

      </div>
    </section>
  );
};

export default Solution;
