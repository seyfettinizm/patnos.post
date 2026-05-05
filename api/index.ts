import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';

dotenv.config();

const app = express();
const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const rootDir = process.cwd();
const distPath = path.join(rootDir, 'dist');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Memory storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Increase to 10MB
});

// Meta Tag Injection Logic
const injectMetaTags = async (html: string, req: express.Request) => {
  let title = "The Patnos Post | Gerçeğin Peşinde, Geleceğin İzinde";
  let description = "Patnos ve çevresinden en güncel haberler, yaşam ve kültür içerikleri.";
  let image = "https://static.wixstatic.com/media/7e2174_e230755889444a418254ba8ec11e24f7~mv2.png";
  let locale = 'tr_TR';
  
  const host = req.headers.host || 'patnos-post-rose.vercel.app';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const appUrl = (process.env.APP_URL || `${protocol}://${host}`).replace(/\/$/, '');
  
  // Use req.originalUrl to preserve the language query param for Facebook
  const fullUrl = `${appUrl}${req.originalUrl}`;

  try {
    let lang = (req.query.lang as string) || 'tr';
    if (!['tr', 'ku'].includes(lang)) lang = 'tr';
    
    // Default metadata for the site
    if (lang === 'ku') {
      title = "The Patnos Post | Li pey rastiyê, li ser şopa pêşerojê";
      description = "Nûçeyên herî dawî ji Patnosê. Çanda me, nûçeyên me, her tişt li vir e.";
      locale = 'ku_TR';
    } else {
      title = "The Patnos Post | Gerçeğin Peşinde, Geleceğin İzinde";
      description = "Patnos Haberleri - Yerel Gündem, Kültür ve Yaşamın Kalbi.";
      locale = 'tr_TR';
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://luphjhodlrnnnnbmwzad.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseKey && supabaseUrl) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch site settings for a better default image if possible
      try {
        const { data: settingsData } = await supabase
          .from('settings')
          .select('value')
          .eq('id', 'header_settings')
          .maybeSingle();
        
        if (settingsData?.value?.leftImageUrl) {
          image = settingsData.value.leftImageUrl;
          console.log(`[MetaTags] Using site logo as base image`);
        }
      } catch (err) {
        console.warn(`[MetaTags] Settings fetch skipped`);
      }

      // Improved newsId extraction
      const parts = req.path.split('/').filter(Boolean);
      let newsId = (parts[0] === 'news' && parts[1]) ? parts[1] : null;
      
      if (newsId && newsId.length > 5) {
        console.log(`[MetaTags] Detected news ID: ${newsId}`);
        const { data: newsItem, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', newsId)
          .maybeSingle();

        if (newsItem && !error) {
          const newsTitle = newsItem.title?.[lang] || newsItem.title?.tr || newsItem.title || 'Haber';
          const newsExcerpt = newsItem.excerpt?.[lang] || newsItem.excerpt?.tr || (newsItem.content?.[lang] || newsItem.content?.tr || '').substring(0, 200) || description;
          
          title = `${newsTitle} | The Patnos Post`;
          description = newsExcerpt;
          
          if (newsItem.imageUrl) {
            image = newsItem.imageUrl.startsWith('http') 
              ? newsItem.imageUrl 
              : `${appUrl}${newsItem.imageUrl.startsWith('/') ? '' : '/'}${newsItem.imageUrl}`;
          }
          console.log(`[MetaTags] Successfully prepared metadata for: ${newsTitle}`);
        } else if (error) {
          console.warn(`[MetaTags] Supabase fetch error:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('[MetaTags] Critical Injection error:', error);
  }

  const escape = (str: string) => {
    if (!str) return "";
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  // Ensure absolute image URL for Facebook - MUST be absolute and high quality
  if (!image || !image.startsWith('http')) {
    image = `${appUrl}/og-image.jpg`;
  }

  return html
    .replace(/__OG_TITLE__/g, escape(title))
    .replace(/__OG_DESCRIPTION__/g, escape(description))
    .replace(/__OG_IMAGE__/g, escape(image))
    .replace(/__OG_URL__/g, escape(fullUrl))
    .replace(/__OG_LOCALE__/g, locale)
    .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`);
};

// API Routes FIRST - No '*' should catch these
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', environment: isProd ? 'production' : 'development' });
});

app.post('/api/login', (req, res) => {
  try {
    const { password } = req.body;
    
    // Debug log for internal use (won't be visible to user)
    console.log('[Auth] Login attempt received');

    if (!password) {
      return res.status(400).json({ success: false, error: 'Password required' });
    }

    const adminPassword = 'Mihriban04';
    const trimmedInput = password.trim();
    
    if (trimmedInput === adminPassword) {
      return res.json({ success: true });
    }
    
    const envPassword = process.env.ADMIN_PASSWORD;
    if (envPassword && trimmedInput === envPassword.trim()) {
      return res.json({ success: true });
    }

    return res.status(401).json({ success: false, error: 'Invalid password' });
  } catch (err) {
    console.error('[API] Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error', details: String(err) });
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabaseAdmin.storage
        .from('news-images')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('[API] Supabase upload error:', error);
        // Fallback to base64 if storage fails (e.g. bucket doesn't exist)
      } else {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('news-images')
          .getPublicUrl(filePath);
        
        return res.json({ 
          success: true, 
          message: 'File uploaded to Supabase', 
          size: req.file.size,
          url: publicUrl
        });
      }
    }

    // Fallback: Base64
    res.json({ 
      success: true, 
      message: 'File received (Base64 fallback)', 
      size: req.file.size,
      url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    });
  } catch (err) {
    console.error('[API] Upload processing error:', err);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send("User-agent: *\nAllow: /");
});

// Vite/Static handling
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      // Don't handle API routes here
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return next();
      }
      
      try {
        let template = fs.readFileSync(path.resolve(rootDir, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        const html = await injectMetaTags(template, req);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    // Serve static files from dist
    app.use('/assets', express.static(path.join(distPath, 'assets')));
    app.use(express.static(distPath, { index: false }));

    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return next();
      }
      
      try {
        const possiblePaths = [
          path.resolve(distPath, 'template.html'),
          path.resolve(distPath, 'index.html'),
          path.resolve(process.cwd(), 'dist/template.html'),
          path.resolve(process.cwd(), 'dist/index.html'),
          path.resolve(process.cwd(), 'index.html'),
        ];
        
        let indexPath = '';
        console.log(`[Server] Searching for template in ${req.path}`);
        for (const p of possiblePaths) {
          if (fs.existsSync(p)) {
            indexPath = p;
            console.log(`[Server] Found template at: ${p}`);
            break;
          }
        }

        if (!indexPath) {
          console.error('[Server] No template found in possible paths:', possiblePaths);
          return res.status(404).send('Platform Error: template not found.');
        }

        const template = fs.readFileSync(indexPath, 'utf-8');
        const html = await injectMetaTags(template, req);
        
        // Disable search engine indexing for dynamic routes if needed, 
        // but for Facebook we want it to work.
        res.status(200).set({ 
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'X-Meta-Injected': 'true'
        }).end(html);
      } catch (e) {
        next(e);
      }
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

// Start the server
startServer().catch(err => {
  console.error('SERVER CRASH:', err);
});

export default app;
