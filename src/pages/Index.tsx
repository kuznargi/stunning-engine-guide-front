import { Link } from "react-router-dom";
import { ArrowRight, Activity, Brain, Leaf, Shield, Zap, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import Problems from "../components/Problems";
import Solution from "../components/Solution";
import Hero from "../components/Hero";
import Header from "../components/HeaderMain"
import Team from "../components/Team"
interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
}) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentWord.substring(0, text.length + 1);
        setText(nextText);
        if (nextText === currentWord) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        const nextText = currentWord.substring(0, text.length - 1);
        setText(nextText);
        if (nextText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => prev + 1);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="relative">
      {text}
      <span className="inline-block w-1 h-10 bg-gradient-to-r from-primary to-secondary ml-1 animate-pulse align-middle opacity-80"></span>
    </span>
  );
};

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Real-time traffic prediction using advanced machine learning algorithms"
    },
    {
      icon: Activity,
      title: "Live Monitoring",
      description: "Track 487K+ vehicles across the city with millisecond precision"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Reduce CO₂ emissions by optimizing traffic flow and routes"
    },
    {
      icon: Shield,
      title: "Smart Safety",
      description: "Instant alerts for accidents, congestion, and road conditions"
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Live data streaming from thousands of sensors citywide"
    },
    {
      icon: TrendingUp,
      title: "Predictive Flow",
      description: "Forecast traffic patterns up to 4 hours in advance"
    }
  ];

  return (

    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated Background */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-success/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header />

<Hero />
<Team />
        {/* Hero Section */}
{/*//         <section className="px-6 pt-20 pb-32">
//           <div className="max-w-7xl mx-auto text-center">
             Badge with Typewriter */}


            {/* Animated Title */}





 {

     //       <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">

//               <div className="glass-card rounded-xl p-6 hover-lift">
//                 <div className="text-4xl font-bold font-mono text-primary mb-2">487K+</div>
//                 <div className="text-sm text-muted-foreground">Транспорта в сети</div>
//               </div>
//               <div className="glass-card rounded-xl p-6 hover-lift">
//                 <div className="text-4xl font-bold font-mono text-success mb-2">-12.4%</div>
//                 <div className="text-sm text-muted-foreground">Выбросы CO₂</div>
//               </div>
//               <div className="glass-card rounded-xl p-6 hover-lift">
//                 <div className="text-4xl font-bold font-mono text-warning mb-2">98.7%</div>
//                 <div className="text-sm text-muted-foreground">Точность прогнозов</div>
//               </div>

       //     </div>

         // </div>

       // </section>
 }
        {/* Features Section
        <section className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-foreground mb-4">
                Возможности платформы
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Полный набор инструментов для управления городским трафиком
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card rounded-xl p-6 hover-lift group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>*/}
    <Problems />
    <Solution /> {/*
//         CTA Section
//         <section className="px-6 py-20">
//           <div className="max-w-4xl mx-auto">
//             <div className="glass-elevated rounded-2xl p-12 text-center relative overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
//               <div className="relative z-10">
//                 <h3 className="text-3xl font-bold text-foreground mb-4">
//                   Готовы к революции в управлении трафиком?
//                 </h3>
//                 <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
//                   Присоединяйтесь к умному городу будущего уже сегодня
//                 </p>
//                 <Link to="/dashboard">
//                   <button className="group px-10 py-5 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg hover:scale-105 transition-all shadow-2xl hover:shadow-primary/50 flex items-center gap-3 mx-auto">
//                     <span>Начать работу</span>
//                     <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
*/}
        {/* Footer */}
        <footer className="px-6 py-8 border-t border-primary/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              © 2025 SoloStack. Все права защищены.
            </div>

          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;