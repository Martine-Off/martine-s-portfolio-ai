
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.project_type AS ENUM ('poc_perso', 'production_client', 'formation_donnees', 'mission_courte', 'profil');
CREATE TYPE public.block_type AS ENUM ('text', 'video', 'image', 'quote', 'heading');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT,
  project_type public.project_type NOT NULL,
  status_label TEXT,
  accent_color TEXT NOT NULL DEFAULT '#65BFF1',
  cover_image_url TEXT,
  cover_image_alt_text TEXT,
  cover_image_position TEXT NOT NULL DEFAULT 'center',
  tags TEXT[] NOT NULL DEFAULT '{}',
  tags_categorises JSONB,
  summary TEXT,
  external_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX one_profil_only ON public.projects ((project_type)) WHERE project_type = 'profil';
CREATE INDEX projects_type_idx ON public.projects (project_type);
CREATE INDEX projects_published_idx ON public.projects (published, display_order);
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Public read published projects" ON public.projects FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins read all projects" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.project_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  block_type public.block_type NOT NULL,
  content TEXT,
  media_url TEXT,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_blocks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.project_blocks TO authenticated;
GRANT ALL ON public.project_blocks TO service_role;
ALTER TABLE public.project_blocks ENABLE ROW LEVEL SECURITY;
CREATE INDEX project_blocks_project_idx ON public.project_blocks (project_id, display_order);
CREATE TRIGGER project_blocks_updated_at BEFORE UPDATE ON public.project_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Public read blocks of published" ON public.project_blocks FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_blocks.project_id AND p.published = true));
CREATE POLICY "Admins read all blocks" ON public.project_blocks FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage blocks" ON public.project_blocks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_title TEXT NOT NULL DEFAULT 'Martine Desmaroux',
  hero_subtitle TEXT NOT NULL DEFAULT 'Cheffe de projet IA',
  hero_intro TEXT NOT NULL DEFAULT 'En reconversion après 20 ans dans l''administration de production du spectacle vivant, je pilote aujourd''hui des projets d''IA et d''automatisation avec la même exigence de méthode, d''écoute et de livraison.',
  cover_image_url TEXT,
  cover_image_alt_text TEXT,
  profile_photo_url TEXT,
  profile_photo_alt_text TEXT,
  contact_email TEXT NOT NULL DEFAULT 'contact@martinedesmaroux.fr',
  linkedin_url TEXT,
  bahut_url TEXT DEFAULT 'https://www.lebahut.io',
  featured_section_title TEXT NOT NULL DEFAULT 'Projets phares',
  formations_section_title TEXT NOT NULL DEFAULT 'Formations données',
  missions_section_title TEXT NOT NULL DEFAULT 'Autres missions courtes',
  tools_section_title TEXT NOT NULL DEFAULT 'Outils & compétences',
  tools_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  footer_text TEXT NOT NULL DEFAULT '© Martine Desmaroux',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (id, tools_json) VALUES (1,
  '[
    {"category":"IA & LLM","items":["ChatGPT","Claude","Gemini","Prompt engineering"]},
    {"category":"Automatisation","items":["n8n","Make","Zapier"]},
    {"category":"Data","items":["Airtable","Notion","Google Sheets"]},
    {"category":"Méthodes","items":["Gestion de projet","Ateliers utilisateurs","Cadrage"]}
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
