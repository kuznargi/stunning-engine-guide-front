import { Flame, Globe, Brain } from "lucide-react";

const Problems = () => {
  const problems = [
    {
      icon: Flame,
      title: "Не знаю, куда пойти прямо сейчас",
      description: "Человек стоит на улице, у него 30–60 мин, но нет идей, всё кажется далеко или закрыто.",
      color: "#F59E0B",
    },
    {
      icon: Globe,
      title: "Трачу время на поиск и карты",
      description: "Открываешь Google Maps, читаешь отзывы, считаешь минуты, уходит 10–15 мин.",
      color: "#10B981",
    },
    {
      icon: Brain,
      title: "Боюсь ошибиться: закрыто / далеко",
      description: "Приходишь, кафе закрыто, или идти 25 мин вместо 5.",
      color: "#00D9FF",
    },
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center text-[#F8FAFC] mb-16 animate-fade-in">
          ПРОБЛЕМЫ
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="glass glass-hover rounded-2xl p-8 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300"
                style={{ 
                  backgroundColor: `${problem.color}20`,
                  boxShadow: `0 0 20px ${problem.color}40`
                }}
              >
                <problem.icon 
                  size={32} 
                  style={{ color: problem.color }}
                />
              </div>
              
              <h3 className="text-2xl font-heading font-semibold text-[#F8FAFC] mb-4">
                {problem.title}
              </h3>
              
              <p className="text-[#94A3B8] leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;
