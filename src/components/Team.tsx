import { User } from "lucide-react";

const Team = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center text-[#F8FAFC] mb-16 animate-fade-in">
          Team
        </h2>

        <div className="glass glass-hover rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 animate-fade-in-up">
          <div className="flex-shrink-0">
{//             <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#6366F1] to-[#00D9FF] flex items-center justify-center glow-indigo">
//               <User size={64} className="text-white" />
//             </div>
 }
<div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#00D9FF]/40 glow-indigo">
    <img
      src="profile.png"
      alt="User avatar"
      className="w-full h-full object-cover"
    />
  </div>


          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-heading font-bold text-[#F8FAFC] mb-3">
              Nargiza Kuzybakhova
            </h3>
            <p className="text-xl text-[#00D9FF] mb-4 font-semibold">
              Full-stack Developer & AI Enthusiast
            </p>
            <p className="text-[#94A3B8] leading-relaxed">
          Я студентка второго курса AITU по направлению Software Engineering.
Увлекаюсь созданием технологий, которые делают жизнь людей лучше.
            На хакатонах я объединила навыки в области ИИ и full-stack разработки.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Team;
