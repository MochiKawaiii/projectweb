require('../utils/MongooseUtil');
const mongoose = require('mongoose');
const Models = require('../models/Models');

const BASE_URL = 'https://whenever.vn';
const START_PAGE = parseInt(process.env.WHENEVER_START_PAGE || '1', 10);
const MAX_PAGES = parseInt(process.env.WHENEVER_MAX_PAGES || '60', 10);
const CONCURRENCY = parseInt(process.env.WHENEVER_CONCURRENCY || '6', 10);
const MAX_PRODUCTS = parseInt(process.env.WHENEVER_MAX_PRODUCTS || '0', 10);
const REQUEST_DELAY_MS = parseInt(process.env.WHENEVER_REQUEST_DELAY_MS || '120', 10);
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';

const CATEGORY_RULES = [
  { keywords: ['cloudline'], name: 'Cloudline', slug: 'cloudline' },
  { keywords: ['raw-denim', 'raw denim'], name: 'Raw Denim', slug: 'raw-denim' },
  { keywords: ['denim'], name: 'Denim', slug: 'denim' },
  { keywords: ['slipper', 'dep'], name: 'Slippers', slug: 'dep' },
  { keywords: ['pajama', 'loungewear'], name: 'Loungewear', slug: 'loungewear' },
  { keywords: ['active', 'sports', 'legging', 'flattering', 'bra'], name: 'Whenever Active', slug: 'whenever-active' },
  { keywords: ['origin'], name: 'Whenever Origin', slug: 'whenever-origin' },
  { keywords: ['hoodie'], name: 'Hoodie', slug: 'hoodie' },
  { keywords: ['tee', 't-shirt', 'tshirt'], name: 'Tee', slug: 'tee' },
  { keywords: ['shirt'], name: 'Shirt', slug: 'shirt' },
  { keywords: ['jacket'], name: 'Jacket', slug: 'jacket' },
  { keywords: ['sweatpants', 'pants', 'trousers'], name: 'Pants', slug: 'pants' },
  { keywords: ['shorts'], name: 'Shorts', slug: 'shorts' },
  { keywords: ['knit', 'sweater', 'polo'], name: 'Knitwear', slug: 'knitwear' },
  { keywords: ['vest'], name: 'Vest', slug: 'vest' },
  { keywords: ['bomber'], name: 'Bomber', slug: 'bomber' },
  { keywords: ['handmade'], name: 'Handmade', slug: 'handmade' },
  { keywords: ['accessor', 'belt', 'hat', 'cap'], name: 'Accessories', slug: 'accessories' },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uniqueStrings(items) {
  return [...new Set((items || []).filter(Boolean))];
}

function decodeHtmlEntities(value = '') {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&ndash;|&mdash;/g, '-')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;|&#160;/g, ' ');
}

function cleanText(value = '') {
  return decodeHtmlEntities(value).replace(/\s+/g, ' ').trim();
}

function splitMultilineText(value = '') {
  return decodeHtmlEntities(value)
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function normalizeLookup(value = '') {
  return cleanText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function slugify(value = '') {
  return normalizeLookup(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'khac';
}

function titleCase(value = '') {
  return cleanText(value)
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .trim();
}

function normalizeImageUrl(url = '') {
  if (!url) return '';
  let normalized = url.trim();
  if (normalized.startsWith('//')) normalized = `https:${normalized}`;
  if (normalized.startsWith('http://')) normalized = `https://${normalized.slice(7)}`;
  normalized = normalized.replace(/_(compact|grande|large|medium|small)(?=\.)/i, '');
  return normalized;
}

async function fetchText(url, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': USER_AGENT,
          'accept-language': 'vi,en-US;q=0.9,en;q=0.8',
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'cache-control': 'no-cache',
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < retries) await sleep(350 * attempt);
    }
  }
  throw lastError;
}

function extractCatalogStats(html) {
  const countMatch = html.match(/(\d+)\s+products/i);
  return countMatch ? Number(countMatch[1]) : null;
}

function extractProductHandles(html) {
  const matches = [...html.matchAll(/href=["']\/products\/([^"'#?\/]+)["']/gi)];
  return uniqueStrings(matches.map((match) => match[1]).filter(Boolean));
}

function extractHaravanMetaProduct(html) {
  const match = html.match(/var meta = (\{[\s\S]*?\});\s*for \(var attr in meta\)/);
  if (!match) return null;
  const parsed = JSON.parse(match[1]);
  return parsed.product || null;
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  return cleanText(match ? match[1] : '');
}

function htmlBlockToLines(html = '') {
  return splitMultilineText(
    String(html)
      .replace(/<\/(p|div|li|section|article|ul|ol|h[1-6])>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  );
}

function stripHtml(html = '') {
  return cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  );
}

function getRelevantText(html) {
  const plainText = stripHtml(html);
  const normalized = normalizeLookup(plainText);
  const markers = ['mo ta san pham', 'xuat xu:', 'phan phoi boi:', 'chat lieu:'];
  let startIndex = 0;
  for (const marker of markers) {
    const markerIndex = normalized.indexOf(marker);
    if (markerIndex !== -1) {
      startIndex = markerIndex;
      break;
    }
  }
  return plainText.slice(startIndex, startIndex + 5000);
}

function extractDescriptionBlock(html = '') {
  const blockMatch = html.match(/<div[^>]+class=["'][^"']*Product-main-card-description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (!blockMatch) return '';
  return htmlBlockToLines(blockMatch[1]).join('\n');
}

function formatMetaDescription(metaDescription = '') {
  if (!metaDescription) return '';

  let normalized = decodeHtmlEntities(metaDescription).replace(/\u00a0/g, ' ').trim();
  const labels = [
    'Xuất xứ',
    'Xuat xu',
    'Phân phối bởi',
    'Phan phoi boi',
    'Địa chỉ',
    'Dia chi',
    'CHẤT LIỆU',
    'Chất liệu',
    'Chat lieu',
    'ĐỊNH LƯỢNG',
    'Định lượng',
    'Dinh luong',
    'FORM',
    'Form',
    'DETAILS',
    'Details',
  ];
  const labelPattern = new RegExp(`(${labels.map((label) => label.replace(/\s+/g, '\\s+')).join('|')})\\s*:`, 'gi');
  const matches = [...normalized.matchAll(labelPattern)];

  if (matches.length === 0) return normalized;

  const segments = matches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : normalized.length;
    return normalized.slice(start, end).trim();
  });

  normalized = segments.join('\n');
  normalized = normalized.replace(/\s+(SẢN PHẨM ĐÃ|SỐ ĐO CÓ THỂ|LƯU Ý\s*:)/g, '\n$1');
  return splitMultilineText(normalized).join('\n');
}

function extractLabelValue(text, label, nextLabels) {
  const normalizedText = normalizeLookup(text);
  const normalizedLabel = normalizeLookup(label);
  const start = normalizedText.indexOf(normalizedLabel);
  if (start === -1) return '';

  const from = start + normalizedLabel.length;
  let end = normalizedText.length;
  for (const nextLabel of nextLabels) {
    const nextIndex = normalizedText.indexOf(normalizeLookup(nextLabel), from);
    if (nextIndex !== -1 && nextIndex < end) end = nextIndex;
  }

  return cleanText(text.slice(from, end));
}

function extractStructuredDetails(html) {
  const descriptionText = extractDescriptionBlock(html) || formatMetaDescription(extractMetaDescription(html));
  const lines = splitMultilineText(descriptionText);
  const structured = {
    origin: '',
    distributor: '',
    address: '',
    form: '',
    material: '',
    details: '',
  };
  const detailLines = [];
  let captureDetails = false;

  for (const line of lines) {
    const normalized = normalizeLookup(line);
    const separatorIndex = line.indexOf(':');
    const value = separatorIndex !== -1 ? cleanText(line.slice(separatorIndex + 1)) : '';

    if (normalized.startsWith('xuat xu') && value) {
      structured.origin = value;
      captureDetails = false;
      continue;
    }
    if (normalized.startsWith('phan phoi boi') && value) {
      structured.distributor = value;
      captureDetails = false;
      continue;
    }
    if (normalized.startsWith('dia chi') && value) {
      structured.address = value;
      captureDetails = false;
      continue;
    }
    if (normalized.startsWith('form') && value) {
      structured.form = value;
      captureDetails = false;
      continue;
    }
    if (normalized.startsWith('chat lieu') && value) {
      structured.material = value;
      captureDetails = false;
      continue;
    }
    if (normalized.startsWith('details') && value) {
      detailLines.push(value);
      captureDetails = true;
      continue;
    }
    if (captureDetails) {
      detailLines.push(cleanText(line));
    }
  }

  if (!structured.details && detailLines.length > 0) {
    structured.details = detailLines.join(' ');
  }

  if (!structured.origin || !structured.distributor || !structured.address || !structured.form || !structured.material || !structured.details) {
    const fallbackText = getRelevantText(html);
    structured.origin = structured.origin || extractLabelValue(fallbackText, 'Xuat xu:', ['Phan phoi boi:', 'Dia chi:', 'Form:', 'Chat lieu:', 'Details:', 'Kich thuoc']);
    structured.distributor = structured.distributor || extractLabelValue(fallbackText, 'Phan phoi boi:', ['Dia chi:', 'Form:', 'Chat lieu:', 'Details:', 'Kich thuoc']);
    structured.address = structured.address || extractLabelValue(fallbackText, 'Dia chi :', ['Form:', 'Chat lieu:', 'Details:', 'Kich thuoc']) || extractLabelValue(fallbackText, 'Dia chi:', ['Form:', 'Chat lieu:', 'Details:', 'Kich thuoc']);
    structured.form = structured.form || extractLabelValue(fallbackText, 'Form:', ['Chat lieu:', 'Details:', 'Kich thuoc']);
    structured.material = structured.material || extractLabelValue(fallbackText, 'Chat lieu:', ['Details:', 'Kich thuoc']);
    structured.details = structured.details || extractLabelValue(fallbackText, 'Details:', ['Kich thuoc', 'Thong bao']);
  }

  return structured;
}

function extractImages(html, productMeta) {
  const ogImages = [...html.matchAll(/<meta\s+property=["']og:image(?::secure_url)?["']\s+content=["']([^"']+)["']/gi)].map((match) => match[1]);
  const cdnImages = [...html.matchAll(/https?:\/\/cdn\.hstatic\.net\/products\/[^"'\s<>]+/gi)].map((match) => match[0]);
  return uniqueStrings([productMeta?.imageUrl, ...ogImages, ...cdnImages]
    .map((image) => normalizeImageUrl(image))
    .filter((image) => image && !image.includes('noDefaultImage')));
}

function normalizePrice(rawPrice) {
  let price = Number(rawPrice) || 0;
  if (price > 10000000) price = Math.round(price / 100);
  return price;
}

function extractSizes(variants = []) {
  return uniqueStrings(
    variants
      .map((variant) => cleanText((variant.variant_title || '').replace(/^SIZE\s*/i, '')))
      .filter(Boolean)
  );
}

function extractColors(title, handle) {
  const source = cleanText(title || handle);
  const slashMatch = source.match(/\/\s*([^/]+)$/);
  if (slashMatch) return [titleCase(slashMatch[1])];

  const tokens = cleanText(handle).split('-');
  if (tokens.length > 1) return [titleCase(tokens.slice(-2).join(' '))];
  return [];
}

function inferCategory(meta) {
  const haystack = normalizeLookup(`${meta.title || ''} ${meta.handle || ''} ${meta.type || ''}`);
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      return { name: rule.name, slug: rule.slug };
    }
  }

  const fallbackName = titleCase(meta.type || 'Khac');
  return { name: fallbackName, slug: slugify(fallbackName) };
}

function buildDescription(html, metaDescription, structured) {
  const blockDescription = extractDescriptionBlock(html);
  if (blockDescription) return blockDescription;

  const formattedMetaDescription = formatMetaDescription(metaDescription);
  if (formattedMetaDescription) return formattedMetaDescription;

  const parts = [];
  if (structured.origin) parts.push(`Xuất xứ: ${structured.origin}`);
  if (structured.distributor) parts.push(`Phân phối bởi: ${structured.distributor}`);
  if (structured.address) parts.push(`Địa chỉ: ${structured.address}`);
  if (structured.material) parts.push(`Chất liệu: ${structured.material}`);
  if (structured.form) parts.push(`Form: ${structured.form}`);
  if (structured.details) parts.push(`Details: ${structured.details}`);
  return uniqueStrings(parts).join('\n').trim();
}

function buildVariants(variants = []) {
  return variants.map((variant) => ({
    id: Number(variant.id) || undefined,
    title: cleanText(variant.title),
    sku: cleanText(variant.sku),
    variant_title: cleanText(variant.variant_title),
  }));
}

async function mapWithConcurrency(items, concurrency, worker) {
  const queue = [...items];
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (typeof item === 'undefined') return;
      await worker(item);
    }
  });
  await Promise.all(runners);
}

async function ensureCategory(categoryInfo, cache) {
  if (!cache.has(categoryInfo.slug)) {
    cache.set(categoryInfo.slug, (async () => {
      const category = await Models.Category.findOneAndUpdate(
        { slug: categoryInfo.slug },
        {
          $set: { name: categoryInfo.name, slug: categoryInfo.slug },
          $setOnInsert: { _id: new mongoose.Types.ObjectId() },
        },
        { upsert: true, new: true }
      ).lean().exec();
      return { _id: category._id, name: category.name, slug: category.slug };
    })());
  }
  return cache.get(categoryInfo.slug);
}

async function upsertProductDocument(productDocument) {
  const existing = await Models.Product.findOne({ slug: productDocument.slug }).select('_id cdate').lean().exec();
  await Models.Product.findOneAndUpdate(
    { slug: productDocument.slug },
    {
      $set: productDocument,
      $setOnInsert: {
        _id: existing?._id || new mongoose.Types.ObjectId(),
        cdate: existing?.cdate || Date.now(),
      },
    },
    { upsert: true, new: true }
  ).exec();
  return Boolean(existing);
}

async function scrapeProduct(handle, categoryCache) {
  const html = await fetchText(`${BASE_URL}/products/${handle}`);
  const meta = extractHaravanMetaProduct(html);
  if (!meta) throw new Error('Embedded product metadata not found');

  const structured = extractStructuredDetails(html);
  const images = extractImages(html, meta);
  const categoryInfo = inferCategory(meta);
  const category = await ensureCategory(categoryInfo, categoryCache);
  const variants = buildVariants(meta.variants || []);

  return {
    name: cleanText(meta.title || handle),
    slug: cleanText(meta.handle || handle),
    price: normalizePrice(meta.price),
    image: images[0] || normalizeImageUrl(meta.imageUrl),
    images,
    description: buildDescription(html, extractMetaDescription(html), structured),
    sizes: extractSizes(meta.variants || []),
    colors: extractColors(meta.title, meta.handle || handle),
    vendor: cleanText(meta.vendor || 'WHENEVER'),
    available: Boolean(meta.available),
    productType: cleanText(meta.type || category.name),
    sourceUrl: `${BASE_URL}/products/${cleanText(meta.handle || handle)}`,
    sourceId: Number(meta.id) || undefined,
    sourcePlatform: 'haravan',
    importedAt: Date.now(),
    origin: structured.origin,
    distributor: structured.distributor,
    address: structured.address,
    material: structured.material,
    form: structured.form,
    details: structured.details,
    variants,
    category,
  };
}

async function collectHandles() {
  const seen = new Set();
  let consecutiveEmptyPages = 0;
  let siteProductCount = null;

  for (let page = START_PAGE; page <= MAX_PAGES; page += 1) {
    const html = await fetchText(`${BASE_URL}/collections/all?page=${page}`);
    if (siteProductCount === null) siteProductCount = extractCatalogStats(html);

    const handles = extractProductHandles(html);
    const newHandles = handles.filter((handle) => !seen.has(handle));
    newHandles.forEach((handle) => seen.add(handle));

    console.log(`[catalog] page ${page}: ${handles.length} handles, ${newHandles.length} new, total ${seen.size}`);

    if (newHandles.length === 0) consecutiveEmptyPages += 1;
    else consecutiveEmptyPages = 0;

    if (MAX_PRODUCTS > 0 && seen.size >= MAX_PRODUCTS) break;
    if (consecutiveEmptyPages >= 2) break;

    await sleep(REQUEST_DELAY_MS);
  }

  const handles = [...seen];
  return {
    handles: MAX_PRODUCTS > 0 ? handles.slice(0, MAX_PRODUCTS) : handles,
    siteProductCount,
  };
}

async function main() {
  const startedAt = Date.now();
  const categoryCache = new Map();

  console.log('[import] Collecting product handles from whenever.vn...');
  const { handles, siteProductCount } = await collectHandles();
  console.log(`[import] Found ${handles.length} unique product handles${siteProductCount ? ` (site says ${siteProductCount} products)` : ''}.`);

  let created = 0;
  let updated = 0;
  let failed = 0;
  let processed = 0;

  await mapWithConcurrency(handles, CONCURRENCY, async (handle) => {
    try {
      const productDocument = await scrapeProduct(handle, categoryCache);
      const existed = await upsertProductDocument(productDocument);
      if (existed) updated += 1;
      else created += 1;
      processed += 1;
      console.log(`[product] ${processed}/${handles.length} ${handle} -> ${existed ? 'updated' : 'created'}`);
    } catch (error) {
      failed += 1;
      processed += 1;
      console.error(`[product] ${processed}/${handles.length} ${handle} -> failed: ${error.message}`);
    }

    if (REQUEST_DELAY_MS > 0) await sleep(REQUEST_DELAY_MS);
  });

  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\n[done] created=${created} updated=${updated} failed=${failed} elapsed=${elapsedSeconds}s`);
  await mongoose.connection.close();
}

main().catch(async (error) => {
  console.error('[fatal]', error);
  await mongoose.connection.close();
  process.exitCode = 1;
});
