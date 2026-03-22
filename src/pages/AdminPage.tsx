'use client';
import { useState, useEffect } from 'react';
import { api, Lead, SiteContent, CourseModule, FAQ, Review, GalleryImage, BlogPost, TeamMember } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import LoginForm from '@/components/admin/LoginForm';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar, { type AdminSection } from '@/components/admin/AdminSidebar';
import ContentManager from '@/components/admin/ContentManager';
import GalleryManager from '@/components/admin/GalleryManager';
import ReviewsManager from '@/components/admin/ReviewsManager';
import BlogManager from '@/components/admin/BlogManager';
import LeadsManager from '@/components/admin/LeadsManager';
import AnalyticsManager from '@/components/admin/AnalyticsManager';
import ModulesManager from '@/components/admin/ModulesManager';
import FAQManager from '@/components/admin/FAQManager';
import TeamManager from '@/components/admin/TeamManager';
import { sampleArticles } from '@/lib/sample-articles';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>('leads');
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
        toast({ title: 'Вход выполнен' });
      } else {
        toast({ title: 'Неверные учётные данные', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка входа', variant: 'destructive' });
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
      toast({ title: 'Ошибка обновления статуса', variant: 'destructive' });
    }
  };

  const handleMarkAsTargeted = async (lead: Lead) => {
    if (!lead.ym_client_id) {
      toast({
        title: 'Нет ClientID из Метрики',
        description: 'Клиент не оставлял заявку через сайт или данные не сохранились.',
        variant: 'destructive',
      });
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
        toast({
          title: 'Целевая конверсия отправлена',
          description: 'В Метрике можно увидеть источник клиента.',
        });
      } else {
        toast({
          title: 'Ошибка отправки в Метрику',
          description: result.error || result.details || 'Неизвестная ошибка',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error marking as targeted:', error);
      toast({
        title: 'Ошибка отправки в Метрику',
        description: 'Проверьте YANDEX_METRIKA_TOKEN в секретах проекта.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateContent = async () => {
    if (!editingKey || !editingValue) return;

    try {
      await api.content.update(editingKey, editingValue, token);
      await loadData(token);
      setEditingKey('');
      setEditingValue('');
      toast({ title: 'Контент обновлён' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      toast({ title: 'Ошибка обновления контента', description: msg, variant: 'destructive' });
    }
  };

  const handleAddContent = async (key: string, value: string) => {
    try {
      await api.content.update(key, value, token);
      await loadData(token);
      toast({ title: 'Поле добавлено' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      toast({ title: 'Ошибка добавления контента', description: msg, variant: 'destructive' });
      throw error;
    }
  };

  const startEditingContent = (item: SiteContent) => {
    setEditingKey(item.key);
    setEditingValue(item.value);
  };

  const handleCreateModule = async () => {
    if (!newModule.title || !newModule.description) {
      toast({ title: 'Заполните обязательные поля', variant: 'destructive' });
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
      toast({ title: 'Модуль создан' });
    } catch (error) {
      toast({ title: 'Ошибка создания модуля', variant: 'destructive' });
    }
  };

  const handleUpdateModule = async () => {
    if (!editingModule) return;
    try {
      await api.modules.update(editingModule, token);
      await loadData(token);
      setEditingModule(null);
      toast({ title: 'Модуль обновлён' });
    } catch (error) {
      toast({ title: 'Ошибка обновления модуля', variant: 'destructive' });
    }
  };

  const handleDeleteModule = async (id: number) => {
    if (!confirm('Удалить модуль?')) return;
    try {
      await api.modules.delete(id, token);
      await loadData(token);
      toast({ title: 'Модуль удалён' });
    } catch (error) {
      toast({ title: 'Ошибка удаления модуля', variant: 'destructive' });
    }
  };

  const handleReorderModule = async (id: number, direction: 'up' | 'down') => {
    try {
      await api.modules.reorder(id, direction, token);
      await loadData(token);
    } catch (error) {
      toast({ title: 'Ошибка смены порядка', variant: 'destructive' });
    }
  };

  const handleCreateFAQ = async () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast({ title: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    try {
      await api.gallery.createFAQ(newFAQ, token);
      await loadData(token);
      setNewFAQ({ question: '', answer: '' });
      toast({ title: 'FAQ создан' });
    } catch (error) {
      toast({ title: 'Ошибка создания FAQ', variant: 'destructive' });
    }
  };

  const handleUpdateFAQ = async () => {
    if (!editingFAQ) return;
    try {
      await api.gallery.updateFAQ(editingFAQ, token);
      await loadData(token);
      setEditingFAQ(null);
      toast({ title: 'FAQ обновлён' });
    } catch (error) {
      toast({ title: 'Ошибка обновления FAQ', variant: 'destructive' });
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    if (!confirm('Удалить FAQ?')) return;
    try {
      await api.gallery.deleteFAQ(id, token);
      await loadData(token);
      toast({ title: 'FAQ удалён' });
    } catch (error) {
      toast({ title: 'Ошибка удаления FAQ', variant: 'destructive' });
    }
  };

  const handleCreateTeamMember = async () => {
    if (!newTeamMember.name || !newTeamMember.role) {
      toast({ title: 'Заполните имя и должность', variant: 'destructive' });
      return;
    }
    try {
      await api.gallery.createTeamMember(newTeamMember, token);
      await loadData(token);
      setNewTeamMember({ name: '', role: '', bio: '', photo_url: '' });
      toast({ title: 'Член команды добавлен' });
    } catch (error) {
      toast({ title: 'Ошибка создания', variant: 'destructive' });
    }
  };

  const handleUpdateTeamMember = async () => {
    if (!editingTeamMember) return;
    try {
      await api.gallery.updateTeamMember(editingTeamMember, token);
      await loadData(token);
      setEditingTeamMember(null);
      toast({ title: 'Данные обновлены' });
    } catch (error) {
      toast({ title: 'Ошибка обновления', variant: 'destructive' });
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    if (!confirm('Удалить члена команды?')) return;
    try {
      await api.gallery.deleteTeamMember(id, token);
      await loadData(token);
      toast({ title: 'Удалено' });
    } catch (error) {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const handleCreateGalleryImage = async () => {
    if (!newGalleryImage.url) {
      toast({ title: 'Укажите URL изображения', variant: 'destructive' });
      return;
    }
    try {
      await api.gallery.createImage(newGalleryImage, token);
      await loadData(token);
      setNewGalleryImage({ url: '', caption: '' });
      toast({ title: 'Изображение добавлено' });
    } catch (error) {
      toast({ title: 'Ошибка добавления изображения', variant: 'destructive' });
    }
  };

  const handleUpdateGalleryImage = async () => {
    if (!editingGalleryImage) return;
    try {
      await api.gallery.updateImage(editingGalleryImage, token);
      await loadData(token);
      setEditingGalleryImage(null);
      toast({ title: 'Изображение обновлено' });
    } catch (error) {
      toast({ title: 'Ошибка обновления изображения', variant: 'destructive' });
    }
  };

  const handleDeleteGalleryImage = async (id: number) => {
    if (!confirm('Удалить изображение?')) return;
    try {
      await api.gallery.deleteImage(id, token);
      await loadData(token);
      toast({ title: 'Изображение удалено' });
    } catch (error) {
      toast({ title: 'Ошибка удаления изображения', variant: 'destructive' });
    }
  };

  const handleCreateReview = async () => {
    if (!newReview.name || !newReview.text) {
      toast({ title: 'Заполните имя и текст отзыва', variant: 'destructive' });
      return;
    }
    try {
      await api.gallery.createReview(newReview, token);
      await loadData(token);
      setNewReview({ name: '', text: '', rating: 5 });
      toast({ title: 'Отзыв добавлен' });
    } catch (error) {
      console.error('Error creating review:', error);
      toast({ title: 'Ошибка добавления отзыва', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    }
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    try {
      await api.gallery.updateReview(editingReview, token);
      await loadData(token);
      setEditingReview(null);
      toast({ title: 'Отзыв обновлён' });
    } catch (error) {
      console.error('Error updating review:', error);
      toast({ title: 'Ошибка обновления отзыва', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return;
    try {
      await api.gallery.deleteReview(id, token);
      await loadData(token);
      toast({ title: 'Отзыв удалён' });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({ title: 'Ошибка удаления отзыва', variant: 'destructive' });
    }
  };

  const handleCreateBlogPost = async () => {
    if (!newBlogPost.title || !newBlogPost.content) {
      toast({ title: 'Заполните заголовок и текст статьи', variant: 'destructive' });
      return;
    }
    try {
      await api.gallery.createBlogPost(newBlogPost, token);
      await loadData(token);
      setNewBlogPost({ title: '', excerpt: '', content: '', image_url: '' });
      toast({ title: 'Статья добавлена' });
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({ title: 'Ошибка добавления статьи', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    }
  };

  const handleUpdateBlogPost = async () => {
    if (!editingBlogPost) return;
    try {
      await api.gallery.updateBlogPost(editingBlogPost, token);
      await loadData(token);
      setEditingBlogPost(null);
      toast({ title: 'Статья обновлена' });
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({ title: 'Ошибка обновления статьи', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    }
  };

  const handleDeleteBlogPost = async (id: number) => {
    if (!confirm('Удалить статью?')) return;
    try {
      await api.gallery.deleteBlogPost(id, token);
      await loadData(token);
      toast({ title: 'Статья удалена' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({ title: 'Ошибка удаления статьи', variant: 'destructive' });
    }
  };

  const handleLoadSampleArticles = async () => {
    try {
      for (const article of sampleArticles) {
        await api.gallery.createBlogPost(article, token);
      }
      await loadData(token);
      toast({ title: 'Загружено 3 экспертных статьи' });
    } catch (error) {
      console.error('Error loading sample articles:', error);
      toast({ title: 'Ошибка загрузки статей', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    }
  };

  const handleGenerateBlogPost = async () => {
    try {
      const res = await api.gallery.generateBlogPost(token);
      await loadData(token);
      toast({ title: res?.ok ? `Статья опубликована: ${res.title || ''}` : 'Статья добавлена' });
    } catch (error) {
      console.error('Error generating blog post:', error);
      toast({ title: 'Ошибка', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} loading={loading} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <AdminHeader onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-auto bg-white">
          <div className={`p-6 ${activeSection === 'leads' || activeSection === 'analytics' ? 'w-full max-w-6xl' : 'max-w-5xl'}`}>
            {activeSection === 'leads' && (
              <LeadsManager
                leads={leads}
                onUpdateStatus={handleUpdateLeadStatus}
                onMarkAsTargeted={handleMarkAsTargeted}
                token={token}
              />
            )}
            {activeSection === 'analytics' && (
              <AnalyticsManager leads={leads} />
            )}
            {activeSection === 'content' && (
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
                onAdd={handleAddContent}
              />
            )}
            {activeSection === 'modules' && (
              <ModulesManager
                modules={modules}
                newModule={newModule}
                editingModule={editingModule}
                onNewModuleChange={(field, value) => setNewModule({ ...newModule, [field]: value })}
                onEditingModuleChange={(field, value) => setEditingModule(editingModule ? { ...editingModule, [field]: value } : null)}
                onCreate={handleCreateModule}
                onUpdate={handleUpdateModule}
                onDelete={handleDeleteModule}
                onReorder={handleReorderModule}
                onStartEditing={setEditingModule}
                onCancelEditing={() => setEditingModule(null)}
              />
            )}
            {activeSection === 'faq' && (
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
            )}
            {activeSection === 'gallery' && (
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
            )}
            {activeSection === 'reviews' && (
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
            )}
            {activeSection === 'blog' && (
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
            )}
            {activeSection === 'team' && (
              <TeamManager
                team={team}
                editingMember={editingTeamMember}
                newMember={newTeamMember}
                onNewMemberChange={(field, value) => setNewTeamMember(prev => ({ ...prev, [field]: value }))}
                onEditingMemberChange={(field, value) => setEditingTeamMember(prev => prev ? { ...prev, [field]: value } : null)}
                onCreate={handleCreateTeamMember}
                onUpdate={handleUpdateTeamMember}
                onDelete={handleDeleteTeamMember}
                onStartEditing={setEditingTeamMember}
                onCancelEditing={() => setEditingTeamMember(null)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}