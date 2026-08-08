CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.equipment TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipment TO authenticated;
GRANT ALL ON public.equipment TO service_role;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view available equipment"
  ON public.equipment FOR SELECT TO anon, authenticated
  USING (available = true);
CREATE POLICY "Admins can view all equipment"
  ON public.equipment FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert equipment"
  ON public.equipment FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update equipment"
  ON public.equipment FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete equipment"
  ON public.equipment FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER equipment_updated_at BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.spare_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.spare_parts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spare_parts TO authenticated;
GRANT ALL ON public.spare_parts TO service_role;
ALTER TABLE public.spare_parts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view available spare parts"
  ON public.spare_parts FOR SELECT TO anon, authenticated
  USING (available = true);
CREATE POLICY "Admins can view all spare parts"
  ON public.spare_parts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert spare parts"
  ON public.spare_parts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update spare parts"
  ON public.spare_parts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete spare parts"
  ON public.spare_parts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER spare_parts_updated_at BEFORE UPDATE ON public.spare_parts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  request_type text NOT NULL,
  item text,
  location text,
  start_date date,
  rental_duration text,
  comments text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view quote requests"
  ON public.quote_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete quote requests"
  ON public.quote_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.equipment (slug, name, brand, category, short_description, description, specs, featured, sort_order) VALUES
('excavadora-cat-320', 'Excavadora CAT 320', 'CAT', 'Excavadoras', 'Excavadora hidráulica de 20 toneladas para movimiento de tierra.', 'Excavadora hidráulica ideal para excavación, carga y demolición en proyectos de mediana y gran escala. Disponible para renta por día, semana o mes con operador opcional.', '[{"label":"Peso operativo","value":"20 t"},{"label":"Potencia","value":"162 hp"},{"label":"Capacidad de cucharón","value":"1.19 m³"}]', true, 1),
('retroexcavadora-jcb-3cx', 'Retroexcavadora JCB 3CX', 'JCB', 'Retroexcavadoras', 'Retroexcavadora versátil para obra urbana y zanjeo.', 'Equipo multipropósito para zanjeo, carga y nivelación en espacios reducidos. Ideal para instalaciones de agua potable, drenajes y obra civil urbana.', '[{"label":"Potencia","value":"109 hp"},{"label":"Profundidad de excavación","value":"5.4 m"},{"label":"Capacidad de pala","value":"1.0 m³"}]', true, 2),
('minicargador-bobcat-s650', 'Minicargador Bobcat S650', 'Bobcat', 'Minicargadores', 'Minicargador compacto con múltiples aditamentos.', 'Minicargador de dirección deslizante para trabajos en espacios reducidos. Compatible con aditamentos como barredora, martillo hidráulico y horquillas.', '[{"label":"Capacidad operativa","value":"1,320 kg"},{"label":"Potencia","value":"74 hp"},{"label":"Aditamentos","value":"Múltiples"}]', true, 3),
('cargador-frontal-komatsu-wa320', 'Cargador Frontal Komatsu WA320', 'Komatsu', 'Cargadores', 'Cargador frontal para manejo de material a granel.', 'Cargador frontal de alto rendimiento para carga de agregados, arena y material selecto en canteras y plantas.', '[{"label":"Capacidad de cucharón","value":"2.7 m³"},{"label":"Potencia","value":"167 hp"},{"label":"Peso operativo","value":"15.5 t"}]', false, 4),
('motoniveladora-volvo-g930', 'Motoniveladora Volvo G930', 'Volvo', 'Motoniveladoras', 'Motoniveladora para conformación de calles y caminos.', 'Motoniveladora para nivelación fina, conformación de terracerías y mantenimiento de caminos rurales.', '[{"label":"Potencia","value":"205 hp"},{"label":"Ancho de cuchilla","value":"3.7 m"},{"label":"Peso operativo","value":"18 t"}]', false, 5),
('excavadora-sany-sy215', 'Excavadora SANY SY215', 'SANY', 'Excavadoras', 'Excavadora de 21 toneladas con bajo consumo de combustible.', 'Excavadora robusta para movimiento de tierra continuo, con excelente relación costo-beneficio en proyectos de larga duración.', '[{"label":"Peso operativo","value":"21.5 t"},{"label":"Potencia","value":"161 hp"},{"label":"Capacidad de cucharón","value":"1.2 m³"}]', false, 6),
('compactadora-xcmg-xs163', 'Compactadora XCMG XS163', 'XCMG', 'Compactación', 'Vibrocompactadora para bases y sub-bases.', 'Rodillo vibratorio para compactación de suelos, bases y sub-bases en proyectos viales y plataformas industriales.', '[{"label":"Peso operativo","value":"16 t"},{"label":"Ancho de rodillo","value":"2.13 m"},{"label":"Potencia","value":"160 hp"}]', false, 7),
('tractor-john-deere-750k', 'Tractor de Oruga John Deere 750K', 'John Deere', 'Tractores', 'Bulldozer para empuje y despalme de terreno.', 'Tractor de oruga para despalme, empuje de material y apertura de accesos en terrenos difíciles.', '[{"label":"Potencia","value":"140 hp"},{"label":"Peso operativo","value":"17 t"},{"label":"Hoja","value":"PAT"}]', false, 8);

INSERT INTO public.spare_parts (name, brand, category, description, sort_order) VALUES
('Filtros de aceite y combustible', 'CAT', 'Filtros', 'Filtros originales y alternos para motores de excavadoras y cargadores CAT.', 1),
('Filtros hidráulicos', 'Komatsu', 'Filtros', 'Filtros para sistemas hidráulicos de excavadoras y cargadores Komatsu.', 2),
('Alternadores y arrancadores', 'John Deere', 'Sistema eléctrico', 'Componentes eléctricos para maquinaria agrícola y de construcción John Deere.', 3),
('Bombas hidráulicas', 'Volvo', 'Sistema hidráulico', 'Bombas y motores hidráulicos para equipo pesado Volvo.', 4),
('Tren de rodaje (cadenas, rodillos, sprockets)', 'SANY', 'Tren de rodaje', 'Componentes de tren de rodaje para excavadoras sobre orugas.', 5),
('Cuchillas y puntas de cucharón', 'JCB', 'Desgaste', 'Elementos de desgaste: puntas, cuchillas y adaptadores.', 6),
('Rodamientos y retenedores', 'Bobcat', 'Transmisión', 'Rodamientos, sellos y retenedores para minicargadores.', 7),
('Kits de mantenimiento preventivo', 'XCMG', 'Mantenimiento', 'Kits completos de filtros y lubricantes para servicio programado.', 8);