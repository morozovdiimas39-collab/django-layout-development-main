import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { api, CourseModule } from '@/lib/api';

export default function ProgramSection() {
  const [modules, setModules] = useState<CourseModule[]>([]);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const data = await api.modules.getByCourse('oratory');
      setModules(data);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const parseDescription = (description: string): string[] => {
    return description
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^-\s*/, ''));
  };
  return (
    <section id="program" className="py-12 px-4 md:py-20 md:px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Программа курса</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 text-sm md:text-base">6 модулей от основ до мастерства публичных выступлений</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {modules.map((module, index) => {
            const topics = parseDescription(module.description);
            return (
              <Card key={module.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col">
                <CardHeader className="pb-3">
                  {module.image_url ? (
                    <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                      <Image
                        src={module.image_url}
                        alt={`Модуль курса ораторского мастерства: ${module.title}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary/30">{index + 1}</span>
                    </div>
                  )}
                  <CardTitle className="text-lg md:text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4 flex flex-col flex-1">
                  <ul className="space-y-2.5 text-muted-foreground flex-1">
                    {topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-primary mt-1.5 shrink-0">•</span>
                        <span className="leading-relaxed text-sm md:text-base">{topic}</span>
                      </li>
                    ))}
                  </ul>
                  {module.result && (
                    <div className="px-4 py-3.5 bg-primary/5 rounded-lg mt-auto min-h-[100px] flex flex-col justify-center">
                      <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Результат модуля</p>
                      <p className="text-sm font-semibold text-foreground leading-relaxed">{module.result}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}