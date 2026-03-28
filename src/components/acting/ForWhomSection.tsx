import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function ForWhomSection() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-balance mb-3 md:mb-4 leading-tight">
          Актёрское искусство в Москве:{' '}
          <span className="text-primary">кому подойдут занятия и как устроен курс</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Занятия для взрослых, кто хочет уверенности, кадра и опоры режиссёра: от базовых упражнений до съёмки — в одной
          логичной программе. Ниже — кому это откликается; структуру курса можно развернуть в программе.
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
                Для тех, кто хочет стать более открытым, раскрепощённым и уверенным в общении
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
              <CardTitle>Стать актёром</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Мечтаете сниматься в кино и на ТВ? Начните путь к профессии с практического курса
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
                Откройте творческие способности и научитесь выражать эмоции через актёрскую игру
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
