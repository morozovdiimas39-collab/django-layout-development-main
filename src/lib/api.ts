const API_URLS = {
  auth: 'https://functions.poehali.dev/83abe3b3-8c2b-4e55-8a3d-5eccd2d5f356',
  content: 'https://functions.poehali.dev/61658db6-95ff-425a-9741-d83782aae247',
  leads: 'https://functions.yandexcloud.net/d4edr6jj85mv48hoo4e1',
  modules: 'https://functions.poehali.dev/c068a827-a908-48e9-8afa-9996a1421fe0',
  gallery: 'https://functions.poehali.dev/42a4a1c9-5ce7-4d3d-8760-f3ef702ed550',
  whatsapp: 'https://functions.poehali.dev/ea8edaad-cd4c-4b81-9401-3e985f910159',
  whatsappSender: 'https://functions.poehali.dev/056bc93d-3039-4809-b29d-580752202bea',
  metrikaConversion: 'https://functions.poehali.dev/5fc35f97-7314-4016-a1bf-571b1d77a189'
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
}

export interface GalleryImage {
  id: number;
  url: string;
  caption?: string;
  order_num: number;
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
      return response.json();
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
      return response.json();
    }
  },
  
  leads: {
    getAll: async (token: string): Promise<Lead[]> => {
      const response = await fetch(API_URLS.leads, {
        headers: { 'X-Auth-Token': token }
      });
      return response.json();
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
      return response.json();
    },
    updateStatus: async (id: number, status: string, token: string) => {
      const response = await fetch(API_URLS.leads, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ id, status })
      });
      return response.json();
    }
  },
  
  modules: {
    getAll: async (): Promise<CourseModule[]> => {
      const response = await fetch(API_URLS.modules);
      return response.json();
    },
    getByCourse: async (courseType: string): Promise<CourseModule[]> => {
      const response = await fetch(`${API_URLS.modules}?course_type=${courseType}`);
      return response.json();
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
      return response.json();
    },
    delete: async (id: number, token: string) => {
      const response = await fetch(API_URLS.modules, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ id })
      });
      return response.json();
    }
  },
  
  gallery: {
    getImages: async (): Promise<GalleryImage[]> => {
      const response = await fetch(`${API_URLS.gallery}?resource=gallery`);
      return response.json();
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
      return response.json();
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
      return response.json();
    },
    deleteImage: async (id: number, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'gallery', id })
      });
      return response.json();
    },
    getReviews: async (): Promise<Review[]> => {
      const response = await fetch(`${API_URLS.gallery}?resource=reviews`);
      return response.json();
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
      if (!response.ok) {
        const error = await response.text();
        console.error('Create review failed:', error);
        throw new Error(`Failed to create review: ${error}`);
      }
      return response.json();
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
      if (!response.ok) {
        const error = await response.text();
        console.error('Update review failed:', error);
        throw new Error(`Failed to update review: ${error}`);
      }
      return response.json();
    },
    deleteReview: async (id: number, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'reviews', id })
      });
      if (!response.ok) {
        const error = await response.text();
        console.error('Delete review failed:', error);
        throw new Error(`Failed to delete review: ${error}`);
      }
      return response.json();
    },
    getFAQ: async (): Promise<FAQ[]> => {
      const response = await fetch(`${API_URLS.gallery}?resource=faq`);
      return response.json();
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
      return response.json();
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
      return response.json();
    },
    deleteFAQ: async (id: number, token: string) => {
      const response = await fetch(API_URLS.gallery, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify({ resource: 'faq', id })
      });
      return response.json();
    },
    getBlog: async (): Promise<BlogPost[]> => {
      const response = await fetch(`${API_URLS.gallery}?resource=blog`);
      return response.json();
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
      return response.json();
    },
    createTeamMember: async (member: Partial<TeamMember>, token: string) => {
      const response = await fetch(`${API_URLS.gallery}?resource=team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        },
        body: JSON.stringify(member)
      });
      return response.json();
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
      return response.json();
    },
    deleteTeamMember: async (id: number, token: string) => {
      const response = await fetch(`${API_URLS.gallery}?resource=team&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token
        }
      });
      return response.json();
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