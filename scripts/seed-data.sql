-- Seed data for Vayutik App Marketplace

-- Insert categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
  ('Productivity', 'productivity', 'Apps to help you get more done', 'Zap', '#3B82F6'),
  ('Design', 'design', 'Creative tools for designers', 'Palette', '#EC4899'),
  ('Development', 'development', 'Tools for developers and programmers', 'Code', '#10B981'),
  ('AI & Machine Learning', 'ai-machine-learning', 'Artificial intelligence powered tools', 'Brain', '#8B5CF6'),
  ('Marketing', 'marketing', 'Grow your business and reach', 'TrendingUp', '#F59E0B'),
  ('Analytics', 'analytics', 'Data and insights tools', 'BarChart3', '#06B6D4'),
  ('Communication', 'communication', 'Team collaboration and messaging', 'MessageSquare', '#6366F1'),
  ('Finance', 'finance', 'Financial management tools', 'DollarSign', '#22C55E')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample apps
INSERT INTO apps (
  name, slug, tagline, description, website_url, 
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT 
  'Notion',
  'notion',
  'All-in-one workspace for notes, docs, and projects',
  'Notion is the connected workspace where better, faster work happens. Now with AI.',
  'https://notion.so',
  'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200',
  'freemium',
  10,
  true,
  true,
  4.8,
  2340,
  150000,
  'Notion Labs, Inc.',
  (SELECT id FROM categories WHERE slug = 'productivity')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'notion');

INSERT INTO apps (
  name, slug, tagline, description, website_url,
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT
  'Figma',
  'figma',
  'The collaborative interface design tool',
  'Figma is a powerful design platform for building products together. Design, prototype, and gather feedback all in one place.',
  'https://figma.com',
  'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
  'freemium',
  15,
  true,
  true,
  4.9,
  3120,
  200000,
  'Figma, Inc.',
  (SELECT id FROM categories WHERE slug = 'design')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'figma');

INSERT INTO apps (
  name, slug, tagline, description, website_url,
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT
  'Linear',
  'linear',
  'The issue tracking tool you''ll enjoy using',
  'Linear is a better way to build software. Streamline issues, sprints, and product roadmaps.',
  'https://linear.app',
  'https://linear.app/static/apple-touch-icon.png',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
  'freemium',
  8,
  true,
  true,
  4.7,
  1890,
  85000,
  'Linear Orbit, Inc.',
  (SELECT id FROM categories WHERE slug = 'development')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'linear');

INSERT INTO apps (
  name, slug, tagline, description, website_url,
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT
  'ChatGPT',
  'chatgpt',
  'AI assistant for conversation and content',
  'ChatGPT helps you get answers, find inspiration, and be more productive. Ask questions, get assistance with writing, and more.',
  'https://chat.openai.com',
  'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
  'freemium',
  20,
  true,
  true,
  4.6,
  8500,
  500000,
  'OpenAI',
  (SELECT id FROM categories WHERE slug = 'ai-machine-learning')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'chatgpt');

INSERT INTO apps (
  name, slug, tagline, description, website_url,
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT
  'Slack',
  'slack',
  'Where work happens',
  'Slack is a business communication platform offering many IRC-style features, including persistent chat rooms organized by topic.',
  'https://slack.com',
  'https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200',
  'freemium',
  12,
  true,
  true,
  4.5,
  4200,
  350000,
  'Salesforce',
  (SELECT id FROM categories WHERE slug = 'communication')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'slack');

INSERT INTO apps (
  name, slug, tagline, description, website_url,
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT
  'Vercel',
  'vercel',
  'Develop. Preview. Ship.',
  'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.',
  'https://vercel.com',
  'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200',
  'freemium',
  20,
  true,
  true,
  4.9,
  2100,
  120000,
  'Vercel Inc.',
  (SELECT id FROM categories WHERE slug = 'development')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'vercel');

INSERT INTO apps (
  name, slug, tagline, description, website_url,
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT
  'Stripe',
  'stripe',
  'Payments infrastructure for the internet',
  'Millions of companies of all sizes use Stripe online and in person to accept payments, send payouts, and manage their businesses.',
  'https://stripe.com',
  'https://stripe.com/favicon.ico',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
  'paid',
  0,
  true,
  true,
  4.8,
  3800,
  280000,
  'Stripe, Inc.',
  (SELECT id FROM categories WHERE slug = 'finance')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'stripe');

INSERT INTO apps (
  name, slug, tagline, description, website_url,
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT
  'Mixpanel',
  'mixpanel',
  'Product analytics for everyone',
  'Powerful, self-serve product analytics to help you convert, engage, and retain more users.',
  'https://mixpanel.com',
  'https://mixpanel.com/favicon.ico',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
  'freemium',
  25,
  false,
  true,
  4.4,
  920,
  45000,
  'Mixpanel, Inc.',
  (SELECT id FROM categories WHERE slug = 'analytics')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'mixpanel');

INSERT INTO apps (
  name, slug, tagline, description, website_url,
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT
  'HubSpot',
  'hubspot',
  'Grow better with HubSpot',
  'HubSpot offers a full platform of marketing, sales, customer service, and CRM software.',
  'https://hubspot.com',
  'https://www.hubspot.com/favicon.ico',
  'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200',
  'freemium',
  45,
  false,
  true,
  4.3,
  1560,
  95000,
  'HubSpot, Inc.',
  (SELECT id FROM categories WHERE slug = 'marketing')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'hubspot');

INSERT INTO apps (
  name, slug, tagline, description, website_url,
  icon_url, cover_url, pricing_type, price,
  featured, verified, average_rating, review_count, total_installs,
  developer_name, category_id
)
SELECT
  'Midjourney',
  'midjourney',
  'AI-powered image generation',
  'Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species.',
  'https://midjourney.com',
  'https://midjourney.com/favicon.ico',
  'https://images.unsplash.com/photo-1686191128892-3261f2f6b8a5?w=1200',
  'subscription',
  10,
  true,
  true,
  4.7,
  5600,
  320000,
  'Midjourney, Inc.',
  (SELECT id FROM categories WHERE slug = 'ai-machine-learning')
WHERE NOT EXISTS (SELECT 1 FROM apps WHERE slug = 'midjourney');
