import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import Icon from '@/components/ui/icon';

interface EditableContentProps {
  contentKey: string;
  defaultValue?: string;
  type?: 'text' | 'textarea' | 'heading';
  page?: string;
  section?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  placeholder?: string;
}

export default function EditableContent({
  contentKey,
  defaultValue = '',
  type = 'text',
  page,
  section,
  className = '',
  as: Component = 'div',
  placeholder = 'Нажмите для редактирования'
}: EditableContentProps) {
  const { isAuthenticated } = useAuth();
  const { getContent, updateContent, isLoading: globalLoading } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const content = getContent(contentKey, defaultValue);

  useEffect(() => {
    if (isEditing && type === 'textarea' && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    } else if (isEditing && type !== 'textarea' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, type]);

  const saveContent = async (newValue: string) => {
    if (!isAuthenticated) return;
    
    try {
      setIsSaving(true);
      const response = await fetch(
        'https://functions.poehali.dev/61658db6-95ff-425a-9741-d83782aae247',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: contentKey,
            value: newValue
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      updateContent(contentKey, newValue);
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    const input = type === 'textarea' ? textareaRef.current : inputRef.current;
    if (input) {
      saveContent(input.value);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey && type === 'textarea') {
      e.preventDefault();
      handleSave();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  if (!isAuthenticated) {
    if (globalLoading) {
      return <Component className={className}>{defaultValue}</Component>;
    }
    return <Component className={className}>{content}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative group">
        {type === 'textarea' ? (
          <textarea
            ref={textareaRef}
            defaultValue={content}
            className={`${className} w-full resize-none border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            onKeyDown={handleKeyDown}
            onInput={adjustTextareaHeight}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            defaultValue={content}
            className={`${className} w-full border-2 border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm flex items-center gap-1"
          >
            <Icon name="Check" size={16} />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm flex items-center gap-1"
          >
            <Icon name="X" size={16} />
            Отмена
          </button>
          {type === 'textarea' && (
            <span className="text-xs text-gray-500 self-center ml-2">
              Ctrl+Enter для сохранения
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Component
      className={`${className} ${globalLoading ? 'opacity-50' : ''} relative group cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-dashed rounded transition-all`}
      onClick={() => setIsEditing(true)}
      title="Нажмите для редактирования"
    >
      {content}
      <span className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
        <Icon name="Pencil" size={12} className="inline mr-1" />
        Редактировать
      </span>
    </Component>
  );
}