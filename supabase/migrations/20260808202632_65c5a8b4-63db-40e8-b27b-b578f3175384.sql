GRANT INSERT ON public.quote_requests TO anon, authenticated;
CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);