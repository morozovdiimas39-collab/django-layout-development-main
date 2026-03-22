export const API_URLS = {
  auth: 'https://functions.yandexcloud.net/d4eq5vh7oqlkrud2jm37',
  content: 'https://functions.yandexcloud.net/d4eqrbaalbc7nhcuj3qq',
  leads: 'https://functions.yandexcloud.net/d4edr6jj85mv48hoo4e1',
  modules: 'https://functions.yandexcloud.net/d4ekdduu52tfmtsjmq4f',
  gallery: 'https://functions.yandexcloud.net/d4efvkeujnc7nmk8at71',
  whatsapp: 'https://functions.yandexcloud.net/d4e3ua2afh8p6196fe3n',
  whatsappSender: 'https://functions.yandexcloud.net/d4ekf1kqhsodfoojvu00',
  metrikaConversion: 'https://functions.yandexcloud.net/d4e1l3lvret5b8ora95c',
  analyzeNote: 'https://functions.yandexcloud.net/d4edf6r0o36gh78pctr0',
};

export interface SiteContent {
  id: number;
  key: string;
  value: string;
  updated_at: string;
}

export interface CourseModule {
  id: number;
  course_type: string;
  title: string;
  description: string;
  result: string;
  image_url?: string;
  order_num: number;
}

export interface Lead {
  id: number;
  name?: string;
  phone: string;
  status: string;
  source: string;
  course?: string;
  message_id?: number;
  ym_client_id?: string;
  created_at: string;
  updated_at: string;
  // UTM
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  yclid?: string;
  gclid?: string;
  referrer?: string;
}

export interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
  image_url?: string;
  order_num: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order_num: number;
  category?: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  caption?: string;
  order_num: number;
  // Дополнительные поля, которые приходят из API в разных разделах
  image_url?: string;
  title?: string;
  description?: string;
  category?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  image_url?: string;
  author?: string;
  published_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface BlogPaginated {
  items: BlogPost[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  sort_order: number;
}

export const api = {
  auth: {
    login: async (username: string, password: string) => {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password })
      });
      return response.json();
    },
    register: async (username: string, password: string) => {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', username, password })
      });
      return response.json();
    }
  },
  
  content: {
    getAll: async (): Promise<SiteContent[]> => {
      const response = await fetch(API_URLS.content);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Content ${response.status}`);
      return Array.isArray(data) ? data : [];
    },
    getByKey: async (key: string): Promise<SiteContent> => {
      const response = await fetch(`${API_URLS.content}?key=${key}`);
      return response.json();
    },
    update: async (key: string, value: string, token?: string) => {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['X-Auth-Token'] = token;
      
      const response = await fetch(API_URLS.content, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ key, value })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Content ${response.status}`);
      return data;
    }
  },
  
  leads: {
    getAll: async (token: string): Promise<Lead[]> => {
      const response = await fetch(API_URLS.leads, {
        headers: { 'X-Auth-Token': token }
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    create: async (data: { 
      name?: string; 
      phone: string; 
      source: string; 
      course?: string;
      utm?: any;
      ym_client_id?: string;
    }) => {
      const response = await fetch(API_URLS.leads, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        const err = new Error((body && body.error) || 'Ошибка отправки') as Error & { body?: unknown };
        err.body = body;
        throw err;
      }
      return body;
    },
    updateStatus: async (id: number, status: string, token: string) => {
      const response = await fetch(API_URLS.leads, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
        body: JSON.stringify({ id, status })
      });
      return response.json();
    },
    updateName: async (id: number, name: string, token: string) => {
      const response = await fetch(API_URLS.leads, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
        body: JSON.stringify({ id, name })
      });
      return response.json();
    }
  },
  
  modules: {
    getAll: async (): Promise<CourseModule[]> => {
      const response = await fetch(API_URLS.modules);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    getByCourse: async (courseType: string): Promise<CourseModule[]> => {
      const response = await fetch(`${API_URLS.modules}?course_type=${courseType}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    create: async (module: Partial<CourseModule>, token: string) => {
      const response = await fetch(API_URLS.modules, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(module)
      });
      return response.json();
    },
    update: async (module: CourseModule, token: string) => {
      const response = await fetch(API_URLS.modules, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(module)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    delete: async (id: number, token: string) => {
      const response = await fetch(`${API_URLS.modules}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ id })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    reorder: async (id: number, direction: 'up' | 'down', token: string) => {
      const response = await fetch(API_URLS.modules, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ action: 'reorder', id, direction })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    }
  },
  
  gallery: {
    getImages: async (): Promise<GalleryImage[]> => {
      const response = await fetch(`${API_URLS.gallery}?resource=gallery`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    createImage: async (image: Partial<GalleryImage>, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'gallery', ...image })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    updateImage: async (image: GalleryImage, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'gallery', ...image })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    deleteImage: async (id: number, token: string) => {
      const response = await fetch(`${API_URLS.gallery}?resource=gallery&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'gallery', id })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    getReviews: async (): Promise<Review[]> => {
      const response = await fetch(`${API_URLS.gallery}?resource=reviews`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    createReview: async (review: Partial<Review>, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'reviews', ...review })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    updateReview: async (review: Review, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'reviews', ...review })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    deleteReview: async (id: number, token: string) => {
      const response = await fetch(`${API_URLS.gallery}?resource=reviews&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'reviews', id })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    getFAQ: async (): Promise<FAQ[]> => {
      const response = await fetch(`${API_URLS.gallery}?resource=faq`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    createFAQ: async (faq: Partial<FAQ>, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'faq', ...faq })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    updateFAQ: async (faq: FAQ, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'faq', ...faq })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    deleteFAQ: async (id: number, token: string) => {
      const response = await fetch(`${API_URLS.gallery}?resource=faq&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'faq', id })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    getBlog: async (page = 1, per_page = 20): Promise<BlogPaginated> => {
      const params = new URLSearchParams({ resource: 'blog', page: String(page), per_page: String(per_page) });
      const response = await fetch(`${API_URLS.gallery}?${params}`);
      const data = await response.json();
      if (data && typeof data === 'object' && Array.isArray(data.items)) {
        return {
          items: data.items,
          total: Number(data.total) || data.items.length,
          page: Number(data.page) || 1,
          per_page: Number(data.per_page) || per_page,
          total_pages: Number(data.total_pages) ?? 1,
        };
      }
      return { items: [], total: 0, page: 1, per_page, total_pages: 0 };
    },
    getBlogPost: async (slug: string): Promise<BlogPost | null> => {
      const response = await fetch(`${API_URLS.gallery}?resource=blog&slug=${encodeURIComponent(slug)}`);
      const data = await response.json();
      return Array.isArray(data) && data[0] ? data[0] : null;
    },
    createBlogPost: async (post: Partial<BlogPost>, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'blog', ...post })
      });
      if (!response.ok) {
        const error = await response.text();
        console.error('Create blog post failed:', error);
        throw new Error(`Failed to create blog post: ${error}`);
      }
      return response.json();
    },
    updateBlogPost: async (post: BlogPost, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'blog', ...post })
      });
      if (!response.ok) {
        const error = await response.text();
        console.error('Update blog post failed:', error);
        throw new Error(`Failed to update blog post: ${error}`);
      }
      return response.json();
    },
    generateBlogPost: async (token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'blog', action: 'generate' })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(err.error || 'Failed to generate post');
      }
      return response.json();
    },
    deleteBlogPost: async (id: number, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'blog', id })
      });
      if (!response.ok) {
        const error = await response.text();
        console.error('Delete blog post failed:', error);
        throw new Error(`Failed to delete blog post: ${error}`);
      }
      return response.json();
    },
    getTeam: async (): Promise<TeamMember[]> => {
      const response = await fetch(`${API_URLS.gallery}?resource=team`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    createTeamMember: async (member: Partial<TeamMember>, token: string) => {
      const response = await fetch(`${API_URLS.gallery}?resource=team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'team', ...member })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    updateTeamMember: async (member: TeamMember, token: string) => {
      const response = await fetch(`${API_URLS.gallery}?resource=team&id=${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(member)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    },
    deleteTeamMember: async (id: number, token: string) => {
      const response = await fetch(`${API_URLS.gallery}?resource=team&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof data?.error === 'string' ? data.error : `Ошибка ${response.status}`);
      return data;
    }
  },
  
  metrika: {
    sendConversion: async (data: {
      client_id: string;
      phone: string;
      course?: string;
      datetime?: string;
    }) => {
      const response = await fetch(API_URLS.metrikaConversion, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  },

  whatsapp: {
    getQueue: async (token: string, status?: string) => {
      const url = status 
        ? `${API_URLS.whatsapp}?resource=queue&status=${status}`
        : `${API_URLS.whatsapp}?resource=queue`;
      
      const response = await fetch(url, {
        headers: { 'X-Auth-Token': token }
      });
      return response.json();
    },
    getTemplates: async (token: string) => {
      const response = await fetch(`${API_URLS.whatsapp}?resource=templates`, {
        headers: { 'X-Auth-Token': token }
      });
      return response.json();
    },
    getStats: async (token: string) => {
      const response = await fetch(`${API_URLS.whatsapp}?resource=stats`, {
        headers: { 'X-Auth-Token': token }
      });
      return response.json();
    },
    updateTemplate: async (template: any, token: string) => {
      const response = await fetch(`${API_URLS.whatsapp}?resource=templates`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(template)
      });
      return response.json();
    },
    sendNow: async (queueId: number, token: string) => {
      const response = await fetch(`${API_URLS.whatsapp}?resource=send_now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ queue_id: queueId })
      });
      return response.json();
    },
    processQueue: async () => {
      const response = await fetch(API_URLS.whatsappSender);
      return response.json();
    },
    createTemplate: async (template: any, token: string) => {
      const response = await fetch(`${API_URLS.whatsapp}?resource=templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(template)
      });
      return response.json();
    },
    deleteTemplate: async (id: number, token: string) => {
      const response = await fetch(`${API_URLS.whatsapp}?resource=templates&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });
      return response.json();
    },
    deleteQueue: async (id: number, token: string) => {
      const response = await fetch(`${API_URLS.whatsapp}?resource=queue&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });
      return response.json();
    },
    deleteQueueByPhone: async (phone: string, token: string) => {
      const response = await fetch(`${API_URLS.whatsapp}?resource=queue&phone=${phone}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });
      return response.json();
    }
  }
};