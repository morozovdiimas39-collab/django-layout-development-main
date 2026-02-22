import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api, Lead, SiteContent, CourseModule, FAQ, Review, GalleryImage, BlogPost, TeamMember } from '@/lib/api';
import LoginForm from '@/components/admin/LoginForm';
import AdminHeader from '@/components/admin/AdminHeader';
import ContentManager from '@/components/admin/ContentManager';
import GalleryManager from '@/components/admin/GalleryManager';
import ReviewsManager from '@/components/admin/ReviewsManager';
import BlogManager from '@/components/admin/BlogManager';
import LeadsManager from '@/components/admin/LeadsManager';
import ModulesManager from '@/components/admin/ModulesManager';
import FAQManager from '@/components/admin/FAQManager';
import TeamManager from '@/components/admin/TeamManager';
import WhatsAppManager from '@/components/admin/WhatsAppManager';
import { sampleArticles } from '@/lib/sample-articles';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [content, setContent] = useState<SiteContent[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const [editingValue, setEditingValue] = useState('');
  
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [newModule, setNewModule] = useState({
    course_type: 'acting',
    title: '',
    description: '',
    result: '',
    image_url: ''
  });
  
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: ''
  });

  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
  const [newGalleryImage, setNewGalleryImage] = useState({
    url: '',
    caption: ''
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [newReview, setNewReview] = useState({
    name: '',
    text: '',
    rating: 5
  });

  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: ''
  });

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: '',
    bio: '',
    photo_url: ''
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      loadData(savedToken);
    }
  }, []);

  const loadData = async (authToken: string) => {
    try {
      const [leadsData, contentData, modulesData, faqData, galleryData, reviewsData, blogData, teamData] = await Promise.all([
        api.leads.getAll(authToken),
        api.content.getAll(),
        api.modules.getAll(),
        api.gallery.getFAQ(),
        api.gallery.getImages(),
        api.gallery.getReviews(),
        api.gallery.getBlog(1, 500),
        api.gallery.getTeam()
      ]);
      setLeads(leadsData);
      setContent(contentData);
      setModules(modulesData);
      setFaqs(faqData);
      setGallery(galleryData);
      setReviews(reviewsData);
      setBlog(blogData.items);
      setTeam(teamData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.auth.login(username, password);
      if (response.success) {
        setToken(response.token);
        setIsAuthenticated(true);
        localStorage.setItem('admin_token', response.token);
        await loadData(response.token);
      } else {
        alert('Неверные учетные данные');
      }
    } catch (error) {
      alert('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    localStorage.removeItem('admin_token');
  };

  const handleUpdateLeadStatus = async (leadId: number, status: string) => {
    try {
      await api.leads.updateStatus(leadId, status, token);
      await loadData(token);
      
      const metrikaGoals: Record<string, string> = {
        'trial': 'trial',
        'enrolled': 'course',
        'thinking': 'wait',
        'irrelevant': 'close'
      };
      
      if (status in metrikaGoals && typeof window !== 'undefined' && (window as any).ym) {
        (window as any).ym(104854671, 'reachGoal', metrikaGoals[status]);
      }
    } catch (error) {
      alert('Ошибка обновления статуса');
    }
  };

  const handleMarkAsTargeted = async (lead: Lead) => {
    if (!lead.ym_client_id) {
      alert('У этого клиента нет ClientID из Метрики.\nЭто значит, что он не оставлял заявку через сайт или его данные не сохранились.');
      return;
    }

    if (!confirm(`Отправить целевую конверсию в Яндекс.Метрику?\n\nТелефон: ${lead.phone}\nКурс: ${lead.course || 'не указан'}\nClientID: ${lead.ym_client_id}`)) return;
    
    try {
      const result = await api.metrika.sendConversion({
        client_id: lead.ym_client_id,
        phone: lead.phone,
        course: lead.course,
        datetime: new Date().toISOString()
      });
      
      if (result.success) {
        alert(`✅ Целевая конверсия отправлена в Яндекс.Метрику!\n\nID загрузки: ${result.upload_id}\nТелефон: ${result.phone}\nКурс: ${result.course || 'не указан'}\nClientID: ${result.client_id}\n\nТеперь в Метрике можно увидеть с какого источника пришёл этот клиент!`);
      } else {
        alert(`Ошибка отправки в Метрику:\n${result.error || 'Неизвестная ошибка'}\n\n${result.details || ''}`);
      }
    } catch (error) {
      console.error('Error marking as targeted:', error);
      alert('Ошибка отправки в Метрику. Проверьте, что добавлен YANDEX_METRIKA_TOKEN в секреты проекта.');
    }
  };

  const handleUpdateContent = async () => {
    if (!editingKey || !editingValue) return;

    try {
      await api.content.update(editingKey, editingValue, token);
      await loadData(token);
      setEditingKey('');
      setEditingValue('');
      alert('Контент обновлен');
    } catch (error) {
      alert('Ошибка обновления контента');
    }
  };

  const startEditingContent = (item: SiteContent) => {
    setEditingKey(item.key);
    setEditingValue(item.value);
  };

  const handleCreateModule = async () => {
    if (!newModule.title || !newModule.description) {
      alert('Заполните обязательные поля');
      return;
    }
    try {
      await api.modules.create(newModule, token);
      await loadData(token);
      setNewModule({
        course_type: 'acting',
        title: '',
        description: '',
        result: '',
        image_url: ''
      });
      alert('Модуль создан');
    } catch (error) {
      alert('Ошибка создания модуля');
    }
  };

  const handleUpdateModule = async () => {
    if (!editingModule) return;
    try {
      await api.modules.update(editingModule, token);
      await loadData(token);
      setEditingModule(null);
      alert('Модуль обновлен');
    } catch (error) {
      alert('Ошибка обновления модуля');
    }
  };

  const handleDeleteModule = async (id: number) => {
    if (!confirm('Удалить модуль?')) return;
    try {
      await api.modules.delete(id, token);
      await loadData(token);
      alert('Модуль удален');
    } catch (error) {
      alert('Ошибка удаления модуля');
    }
  };

  const handleCreateFAQ = async () => {
    if (!newFAQ.question || !newFAQ.answer) {
      alert('Заполните все поля');
      return;
    }
    try {
      await api.gallery.createFAQ(newFAQ, token);
      await loadData(token);
      setNewFAQ({ question: '', answer: '' });
      alert('FAQ создан');
    } catch (error) {
      alert('Ошибка создания FAQ');
    }
  };

  const handleUpdateFAQ = async () => {
    if (!editingFAQ) return;
    try {
      await api.gallery.updateFAQ(editingFAQ, token);
      await loadData(token);
      setEditingFAQ(null);
      alert('FAQ обновлен');
    } catch (error) {
      alert('Ошибка обновления FAQ');
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    if (!confirm('Удалить FAQ?')) return;
    try {
      await api.gallery.deleteFAQ(id, token);
      await loadData(token);
      alert('FAQ удален');
    } catch (error) {
      alert('Ошибка удаления FAQ');
    }
  };

  const handleCreateTeamMember = async () => {
    if (!newTeamMember.name || !newTeamMember.role) {
      alert('Заполните имя и должность');
      return;
    }
    try {
      await api.gallery.createTeamMember(newTeamMember, token);
      await loadData(token);
      setNewTeamMember({ name: '', role: '', bio: '', photo_url: '' });
      alert('Член команды добавлен');
    } catch (error) {
      alert('Ошибка создания');
    }
  };

  const handleUpdateTeamMember = async () => {
    if (!editingTeamMember) return;
    try {
      await api.gallery.updateTeamMember(editingTeamMember, token);
      await loadData(token);
      setEditingTeamMember(null);
      alert('Данные обновлены');
    } catch (error) {
      alert('Ошибка обновления');
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    if (!confirm('Удалить члена команды?')) return;
    try {
      await api.gallery.deleteTeamMember(id, token);
      await loadData(token);
      alert('Удалено');
    } catch (error) {
      alert('Ошибка удаления');
    }
  };

  const handleCreateGalleryImage = async () => {
    if (!newGalleryImage.url) {
      alert('Укажите URL изображения');
      return;
    }
    try {
      await api.gallery.createImage(newGalleryImage, token);
      await loadData(token);
      setNewGalleryImage({ url: '', caption: '' });
      alert('Изображение добавлено');
    } catch (error) {
      alert('Ошибка добавления изображения');
    }
  };

  const handleUpdateGalleryImage = async () => {
    if (!editingGalleryImage) return;
    try {
      await api.gallery.updateImage(editingGalleryImage, token);
      await loadData(token);
      setEditingGalleryImage(null);
      alert('Изображение обновлено');
    } catch (error) {
      alert('Ошибка обновления изображения');
    }
  };

  const handleDeleteGalleryImage = async (id: number) => {
    if (!confirm('Удалить изображение?')) return;
    try {
      await api.gallery.deleteImage(id, token);
      await loadData(token);
      alert('Изображение удалено');
    } catch (error) {
      alert('Ошибка удаления изображения');
    }
  };

  const handleCreateReview = async () => {
    if (!newReview.name || !newReview.text) {
      alert('Заполните имя и текст отзыва');
      return;
    }
    try {
      await api.gallery.createReview(newReview, token);
      await loadData(token);
      setNewReview({ name: '', text: '', rating: 5 });
      alert('Отзыв добавлен');
    } catch (error) {
      console.error('Error creating review:', error);
      alert(`Ошибка добавления отзыва: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    try {
      await api.gallery.updateReview(editingReview, token);
      await loadData(token);
      setEditingReview(null);
      alert('Отзыв обновлен');
    } catch (error) {
      console.error('Error updating review:', error);
      alert(`Ошибка обновления отзыва: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return;
    try {
      await api.gallery.deleteReview(id, token);
      await loadData(token);
      alert('Отзыв удален');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(`Ошибка удаления отзыва: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreateBlogPost = async () => {
    if (!newBlogPost.title || !newBlogPost.content) {
      alert('Заполните заголовок и текст статьи');
      return;
    }
    try {
      await api.gallery.createBlogPost(newBlogPost, token);
      await loadData(token);
      setNewBlogPost({ title: '', excerpt: '', content: '', image_url: '' });
      alert('Статья добавлена');
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert(`Ошибка добавления статьи: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateBlogPost = async () => {
    if (!editingBlogPost) return;
    try {
      await api.gallery.updateBlogPost(editingBlogPost, token);
      await loadData(token);
      setEditingBlogPost(null);
      alert('Статья обновлена');
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert(`Ошибка обновления статьи: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteBlogPost = async (id: number) => {
    if (!confirm('Удалить статью?')) return;
    try {
      await api.gallery.deleteBlogPost(id, token);
      await loadData(token);
      alert('Статья удалена');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert(`Ошибка удаления статьи: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleLoadSampleArticles = async () => {
    try {
      for (const article of sampleArticles) {
        await api.gallery.createBlogPost(article, token);
      }
      await loadData(token);
      alert('✅ Загружено 3 экспертных статьи по актёрскому мастерству!');
    } catch (error) {
      console.error('Error loading sample articles:', error);
      alert(`Ошибка загрузки статей: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleGenerateBlogPost = async () => {
    try {
      const res = await api.gallery.generateBlogPost(token);
      await loadData(token);
      alert(res?.ok ? `✅ Статья опубликована: ${res.title || ''}` : 'Статья добавлена');
    } catch (error) {
      console.error('Error generating blog post:', error);
      alert(`Ошибка: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} loading={loading} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
            <TabsTrigger value="leads">Заявки</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="modules">Модули</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="gallery">Галерея</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы</TabsTrigger>
            <TabsTrigger value="blog">Блог</TabsTrigger>
            <TabsTrigger value="team">Команда</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <LeadsManager 
              leads={leads} 
              onUpdateStatus={handleUpdateLeadStatus}
              onMarkAsTargeted={handleMarkAsTargeted}
            />
          </TabsContent>

          <TabsContent value="whatsapp">
            <WhatsAppManager token={token} />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager
              content={content}
              editingKey={editingKey}
              editingValue={editingValue}
              onStartEditing={startEditingContent}
              onValueChange={setEditingValue}
              onUpdate={handleUpdateContent}
              onCancel={() => {
                setEditingKey('');
                setEditingValue('');
              }}
            />
          </TabsContent>

          <TabsContent value="modules">
            <ModulesManager
              modules={modules}
              newModule={newModule}
              editingModule={editingModule}
              onNewModuleChange={(field, value) => setNewModule({ ...newModule, [field]: value })}
              onEditingModuleChange={(field, value) => setEditingModule(editingModule ? { ...editingModule, [field]: value } : null)}
              onCreate={handleCreateModule}
              onUpdate={handleUpdateModule}
              onDelete={handleDeleteModule}
              onStartEditing={setEditingModule}
              onCancelEditing={() => setEditingModule(null)}
            />
          </TabsContent>

          <TabsContent value="faq">
            <FAQManager
              faqs={faqs}
              newFAQ={newFAQ}
              editingFAQ={editingFAQ}
              onNewFAQChange={(field, value) => setNewFAQ({ ...newFAQ, [field]: value })}
              onEditingFAQChange={(field, value) => setEditingFAQ(editingFAQ ? { ...editingFAQ, [field]: value } : null)}
              onCreate={handleCreateFAQ}
              onUpdate={handleUpdateFAQ}
              onDelete={handleDeleteFAQ}
              onStartEditing={setEditingFAQ}
              onCancelEditing={() => setEditingFAQ(null)}
            />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManager
              gallery={gallery}
              newGalleryImage={newGalleryImage}
              editingGalleryImage={editingGalleryImage}
              onNewImageChange={(field, value) => setNewGalleryImage({ ...newGalleryImage, [field]: value })}
              onEditingImageChange={(field, value) => setEditingGalleryImage(editingGalleryImage ? { ...editingGalleryImage, [field]: value } : null)}
              onCreate={handleCreateGalleryImage}
              onUpdate={handleUpdateGalleryImage}
              onDelete={handleDeleteGalleryImage}
              onStartEditing={setEditingGalleryImage}
              onCancelEditing={() => setEditingGalleryImage(null)}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManager
              reviews={reviews}
              newReview={newReview}
              editingReview={editingReview}
              onNewReviewChange={(field, value) => setNewReview({ ...newReview, [field]: value })}
              onEditingReviewChange={(field, value) => setEditingReview(editingReview ? { ...editingReview, [field]: value } : null)}
              onCreate={handleCreateReview}
              onUpdate={handleUpdateReview}
              onDelete={handleDeleteReview}
              onStartEditing={setEditingReview}
              onCancelEditing={() => setEditingReview(null)}
            />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager
              blog={blog}
              onGenerate={handleGenerateBlogPost}
              newBlogPost={newBlogPost}
              editingBlogPost={editingBlogPost}
              onNewPostChange={(field, value) => setNewBlogPost({ ...newBlogPost, [field]: value })}
              onEditingPostChange={(field, value) => setEditingBlogPost(editingBlogPost ? { ...editingBlogPost, [field]: value } : null)}
              onCreate={handleCreateBlogPost}
              onUpdate={handleUpdateBlogPost}
              onDelete={handleDeleteBlogPost}
              onStartEditing={setEditingBlogPost}
              onCancelEditing={() => setEditingBlogPost(null)}
              onLoadSamples={handleLoadSampleArticles}
            />
          </TabsContent>

          <TabsContent value="team">
            <TeamManager
              team={team}
              editingMember={editingTeamMember}
              newMember={newTeamMember}
              onNewMemberChange={(field, value) => setNewTeamMember(prev => ({...prev, [field]: value}))}
              onEditingMemberChange={(field, value) => setEditingTeamMember(prev => prev ? {...prev, [field]: value} : null)}
              onCreate={handleCreateTeamMember}
              onUpdate={handleUpdateTeamMember}
              onDelete={handleDeleteTeamMember}
              onStartEditing={setEditingTeamMember}
              onCancelEditing={() => setEditingTeamMember(null)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}