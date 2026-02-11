import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { TeamMember } from '@/lib/api';

interface TeamSectionProps {
  team: TeamMember[];
}

export default function TeamSection({ team }: TeamSectionProps) {
  return (
    <section id="team" className="py-12 px-4 md:py-20 md:px-4 bg-card">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Наша команда</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto">
          Профессионалы с многолетним опытом, которые помогут вам раскрыть свой потенциал
        </p>
        {team.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <Card key={member.id} className="group hover:shadow-xl transition overflow-hidden">
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/5 to-primary/20">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={`${member.name} - ${member.role}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon name="User" className="text-primary/30" size={80} />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">{member.role}</CardDescription>
                </CardHeader>
                {member.bio && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Icon name="Users" size={64} className="mx-auto mb-4 opacity-30" />
            <p>Информация о команде скоро появится</p>
          </div>
        )}
      </div>
    </section>
  );
}