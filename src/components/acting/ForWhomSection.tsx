import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function ForWhomSection() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Для кого этот курс?</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Курс подходит для всех, кто хочет развить актерские навыки, уверенность в себе и раскрыть свой творческий потенциал
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="Users" className="text-primary" size={24} />
              </div>
              <CardTitle>Побороть застенчивость</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Для тех, кто хочет стать более открытым, раскрепощенным и уверенным в общении
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="Camera" className="text-primary" size={24} />
              </div>
              <CardTitle>Преодолеть страх камеры</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Научитесь естественно вести себя перед камерой и в кадре
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="Star" className="text-primary" size={24} />
              </div>
              <CardTitle>Стать актером</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Мечтаете сниматься в кино и на ТВ? Начните свой путь к профессии актера с нашего курса
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="Sparkles" className="text-primary" size={24} />
              </div>
              <CardTitle>Раскрыть потенциал</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Откройте в себе творческие способности и научитесь выражать эмоции через актерскую игру
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}