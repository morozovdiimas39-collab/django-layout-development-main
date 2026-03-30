-- Ответ при /start: переименование поля и убирание лишних колонок (идемпотентно по возможности)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'chat_bots' AND column_name = 'system_prompt'
  ) THEN
    ALTER TABLE public.chat_bots RENAME COLUMN system_prompt TO start_message;
  END IF;
END $$;
ALTER TABLE public.chat_bots DROP COLUMN IF EXISTS notes;
ALTER TABLE public.chat_bots DROP COLUMN IF EXISTS content_key;
