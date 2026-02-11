import Icon from '@/components/ui/icon';

export default function ResultsSection() {
  return (
    <section className="py-12 px-4 md:py-20 md:px-4 bg-card">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center mb-8 md:mb-12">
          <Icon name="Sparkles" size={56} className="mx-auto mb-4 text-primary" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Результаты, которые <span className="text-primary">вы получите</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 max-w-3xl mx-auto">
            После прохождения курса вы овладеете мастерством публичных выступлений! 🎤
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="bg-background p-6 rounded-2xl border border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon name="Mic" className="text-primary" size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Уверенность на сцене</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Полностью избавитесь от страха публичных выступлений и научитесь чувствовать себя свободно перед любой аудиторией
            </p>
          </div>

          <div className="bg-background p-6 rounded-2xl border border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon name="Volume2" className="text-primary" size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Голос и речь</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Поставите красивый, звучный голос, усовершенствуете дикцию и научитесь управлять интонациями для максимального воздействия
            </p>
          </div>

          <div className="bg-background p-6 rounded-2xl border border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon name="BookOpen" className="text-primary" size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Структура и логика</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Научитесь строить убедительные речи, использовать сторителлинг и грамотно аргументировать свою позицию
            </p>
          </div>

          <div className="bg-background p-6 rounded-2xl border border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon name="Zap" className="text-primary" size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Харизма и энергетика</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Овладеете языком тела, научитесь управлять жестами, мимикой и пространством для создания магнетического присутствия
            </p>
          </div>

          <div className="bg-background p-6 rounded-2xl border border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon name="Users" className="text-primary" size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Работа с аудиторией</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Научитесь удерживать внимание слушателей, отвечать на каверзные вопросы и импровизировать в любой ситуации
            </p>
          </div>

          <div className="bg-background p-6 rounded-2xl border border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Icon name="Brain" className="text-primary" size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Психологическая свобода</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Снимете зажимы, освоите техники управления стрессом и обретете внутреннюю уверенность для выступлений
            </p>
          </div>
        </div>

        <div className="aspect-video w-full md:max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src="https://player.vimeo.com/video/997324695?h=b0c5654470"
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            title="Результаты курса ораторского искусства"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
