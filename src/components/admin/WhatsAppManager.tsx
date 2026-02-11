import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { QueueItem, Template, Stats } from './whatsapp/types';
import StatsCards from './whatsapp/StatsCards';
import QueueTab from './whatsapp/QueueTab';
import TemplatesTab from './whatsapp/TemplatesTab';
import MessageDialog from './whatsapp/MessageDialog';
import TemplateDialog from './whatsapp/TemplateDialog';
import CreateTemplateDialog from './whatsapp/CreateTemplateDialog';

interface WhatsAppManagerProps {
  token: string;
}

export default function WhatsAppManager({ token }: WhatsAppManagerProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<QueueItem | null>(null);
  const [creatingTemplate, setCreatingTemplate] = useState(false);

  useEffect(() => {
    loadData();
  }, [token, filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [queueData, templatesData, statsData] = await Promise.all([
        api.whatsapp.getQueue(token, filter === 'all' ? undefined : filter),
        api.whatsapp.getTemplates(token),
        api.whatsapp.getStats(token)
      ]);
      
      setQueue(queueData);
      setTemplates(templatesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading WhatsApp data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessQueue = async () => {
    setLoading(true);
    try {
      const result = await api.whatsapp.processQueue();
      alert(`✅ Обработано: ${result.processed}\n📤 Отправлено: ${result.sent}\n❌ Ошибки: ${result.failed}`);
      loadData();
    } catch (error) {
      alert('Ошибка при обработке очереди');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNow = async (queueId: number) => {
    setLoading(true);
    try {
      await api.whatsapp.sendNow(queueId, token);
      alert('✅ Сообщение перемещено в очередь для немедленной отправки');
      loadData();
    } catch (error) {
      alert('Ошибка при перемещении сообщения');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (template: Template) => {
    setLoading(true);
    try {
      await api.whatsapp.updateTemplate(template, token);
      alert('✅ Шаблон успешно обновлён');
      setEditingTemplate(null);
      loadData();
    } catch (error) {
      alert('Ошибка при обновлении шаблона');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (template: any) => {
    setLoading(true);
    try {
      await api.whatsapp.createTemplate(template, token);
      alert('✅ Шаблон успешно создан');
      setCreatingTemplate(false);
      loadData();
    } catch (error) {
      alert('Ошибка при создании шаблона');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    setLoading(true);
    try {
      await api.whatsapp.deleteTemplate(id, token);
      alert('✅ Шаблон удалён');
      loadData();
    } catch (error) {
      alert('Ошибка при удалении шаблона');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQueue = async (id: number) => {
    setLoading(true);
    try {
      await api.whatsapp.deleteQueue(id, token);
      alert('✅ Сообщение удалено из очереди');
      loadData();
    } catch (error) {
      alert('Ошибка при удалении сообщения');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteByPhone = async (phone: string) => {
    setLoading(true);
    try {
      const result = await api.whatsapp.deleteQueueByPhone(phone, token);
      alert(`✅ Удалено сообщений: ${result.deleted}`);
      loadData();
    } catch (error) {
      alert('Ошибка при удалении сообщений');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Icon name="MessageCircle" className="text-green-600" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">WhatsApp рассылки</h2>
          </div>
          <p className="text-gray-600">Управление автоматическими рассылками через Green API</p>
        </div>
        <Button 
          onClick={handleProcessQueue} 
          disabled={loading}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
        >
          <Icon name="Send" className="mr-2" size={18} />
          Отправить сейчас
        </Button>
      </div>

      {stats && <StatsCards stats={stats} />}

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 bg-gray-100">
          <TabsTrigger value="queue" className="gap-2">
            <Icon name="List" size={16} />
            Очередь сообщений
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <Icon name="FileText" size={16} />
            Шаблоны
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <QueueTab
            queue={queue}
            filter={filter}
            loading={loading}
            onFilterChange={setFilter}
            onSendNow={handleSendNow}
            onViewMessage={setSelectedMessage}
            onDelete={handleDeleteQueue}
            onDeleteByPhone={handleDeleteByPhone}
          />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesTab
            templates={templates}
            onEditTemplate={setEditingTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onCreateTemplate={() => setCreatingTemplate(true)}
          />
        </TabsContent>
      </Tabs>

      <MessageDialog
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />

      <TemplateDialog
        template={editingTemplate}
        loading={loading}
        onChange={setEditingTemplate}
        onSave={() => editingTemplate && handleUpdateTemplate(editingTemplate)}
        onClose={() => setEditingTemplate(null)}
        onFileUpload={async () => ''}
      />

      <CreateTemplateDialog
        open={creatingTemplate}
        loading={loading}
        onClose={() => setCreatingTemplate(false)}
        onCreate={handleCreateTemplate}
        onFileUpload={async () => ''}
      />
    </div>
  );
}