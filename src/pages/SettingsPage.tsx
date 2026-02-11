import { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState('');
  const [botToken, setBotToken] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Настройки Telegram бота - Казбек Меретуков</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">Настройки бота</h1>
              <p className="text-muted-foreground">
                Настройте Telegram бота с интеграцией Gemini AI
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Bot" size={24} />
                  API ключи и настройки
                </CardTitle>
                <CardDescription>
                  Введите данные для работы Telegram бота
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gemini">Gemini API Key</Label>
                  <Input
                    id="gemini"
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Получите ключ на{' '}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bot">Telegram Bot Token</Label>
                  <Input
                    id="bot"
                    type="password"
                    placeholder="1234567890:ABC..."
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Получите токен у{' '}
                    <a
                      href="https://t.me/BotFather"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      @BotFather
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proxy">Прокси (опционально)</Label>
                  <Input
                    id="proxy"
                    type="text"
                    placeholder="https://user:pass@proxy.example.com:8080"
                    value={proxyUrl}
                    onChange={(e) => setProxyUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    HTTPS прокси для доступа к Telegram API
                  </p>
                </div>

                <Button onClick={handleSave} className="w-full" size="lg">
                  {saved ? (
                    <>
                      <Icon name="Check" size={20} className="mr-2" />
                      Сохранено
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={20} className="mr-2" />
                      Сохранить настройки
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Terminal" size={24} />
                  Webhook URL
                </CardTitle>
                <CardDescription>
                  Настройте webhook в вашем Telegram боте
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm break-all">
                    https://functions.poehali.dev/ee18a8c5-48c7-4ecd-bf90-d69fbfc2d751
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Отправьте этот URL боту через команду:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm break-all">
                    curl -X POST https://api.telegram.org/bot&lt;YOUR_TOKEN&gt;/setWebhook?url=https://functions.poehali.dev/ee18a8c5-48c7-4ecd-bf90-d69fbfc2d751
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Info" size={24} />
                  Информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Icon name="Sparkles" size={18} className="text-primary mt-0.5" />
                  <div>
                    <strong>Gemini 2.0 Flash Experimental</strong>
                    <p className="text-muted-foreground">
                      Быстрая и эффективная модель для обработки сообщений
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Shield" size={18} className="text-primary mt-0.5" />
                  <div>
                    <strong>Прокси поддержка</strong>
                    <p className="text-muted-foreground">
                      Поддержка HTTPS прокси для доступа к Telegram API
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Zap" size={18} className="text-primary mt-0.5" />
                  <div>
                    <strong>Cloud Functions</strong>
                    <p className="text-muted-foreground">
                      Бот работает на serverless платформе
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
