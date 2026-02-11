import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { CourseModule } from '@/lib/api';

interface ModulesSectionProps {
  modules: CourseModule[];
}

export default function ModulesSection({ modules }: ModulesSectionProps) {
  return (
    <section id="modules" className="py-12 px-4 md:py-20 md:px-4 bg-card">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Программа курса</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 text-sm md:text-base">6 модулей от базы до съемок собственного кино</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <Card key={module.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  {module.image_url ? (
                    <img src={module.image_url} alt={`Модуль курса: ${module.title}`} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <span className="text-6xl font-bold text-primary/30">{index + 1}</span>
                    </div>
                  )}
                </div>
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col flex-1">
                <ul className="space-y-2.5 text-muted-foreground flex-1">
                  {module.description.split('\n').filter(line => line.trim()).map((line, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-primary mt-1.5 shrink-0">•</span>
                      <span className="leading-relaxed">{line.replace(/^-\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-3.5 bg-primary/5 rounded-lg mt-auto min-h-[100px] flex flex-col justify-center">
                  <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Результат модуля</p>
                  <p className="text-sm font-semibold text-foreground leading-relaxed">{module.result}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}