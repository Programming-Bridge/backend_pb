/**
 * GeoIP and User-Agent Parsing Utility
 * Extracts client IP and device information cleanly and reliably.
 */

// Helper to extract clean client IP
function extractClientIp(req) {
    if (!req) return '127.0.0.1';

    let ip = '';

    // Check Cloudflare / CDN headers
    const cfIp = req.headers['cf-connecting-ip'];
    const xRealIp = req.headers['x-real-ip'];
    const xForwardedFor = req.headers['x-forwarded-for'];
    const fastlyIp = req.headers['fastly-client-ip'];
    const trueClientIp = req.headers['true-client-ip'];

    if (cfIp && typeof cfIp === 'string') {
        ip = cfIp.trim();
    } else if (trueClientIp && typeof trueClientIp === 'string') {
        ip = trueClientIp.trim();
    } else if (fastlyIp && typeof fastlyIp === 'string') {
        ip = fastlyIp.trim();
    } else if (xRealIp && typeof xRealIp === 'string') {
        ip = xRealIp.trim();
    } else if (xForwardedFor && typeof xForwardedFor === 'string') {
        // x-forwarded-for can be a comma-separated list of IPs: "client, proxy1, proxy2"
        const ips = xForwardedFor.split(',');
        ip = ips[0].trim();
    } else if (req.ip) {
        ip = req.ip;
    } else if (req.socket && req.socket.remoteAddress) {
        ip = req.socket.remoteAddress;
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    }

    // Clean IPv6 IPv4-mapped notation (e.g. ::ffff:192.168.1.1 -> 192.168.1.1)
    if (ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }

    if (ip === '::1' || ip === '::' || ip === '0.0.0.0') {
        ip = '127.0.0.1';
    }

    return ip || '127.0.0.1';
}

// Check if IP is private/local
function isPrivateIp(ip) {
    if (!ip) return true;
    if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1') return true;
    if (ip.startsWith('10.') || ip.startsWith('192.168.')) return true;
    if (ip.startsWith('172.')) {
        const parts = ip.split('.');
        const second = parseInt(parts[1], 10);
        if (second >= 16 && second <= 31) return true;
    }
    return false;
}

// Parse User Agent string to extract Device, OS, and Browser
function parseUserAgent(uaString = '') {
    const ua = (uaString || '').toLowerCase();

    // 1. Device Type Detection
    let device = 'Desktop';
    if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry|bb10/i.test(ua)) {
        device = 'Mobile';
    } else if (/ipad|tablet|android(?!.*mobile)|kindle|playbook|silk/i.test(ua)) {
        device = 'Tablet';
    } else if (/bot|crawler|spider|slurp|facebookexternalhit|bingbot|googlebot/i.test(ua)) {
        device = 'Bot';
    }

    // 2. Browser Detection
    let browser = 'Unknown Browser';
    if (/edg\//i.test(ua)) {
        browser = 'Microsoft Edge';
    } else if (/opr\/|opera/i.test(ua)) {
        browser = 'Opera';
    } else if (/brave/i.test(ua)) {
        browser = 'Brave';
    } else if (/samsungbrowser/i.test(ua)) {
        browser = 'Samsung Internet';
    } else if (/ucbrowser/i.test(ua)) {
        browser = 'UC Browser';
    } else if (/chrome|crios/i.test(ua)) {
        browser = 'Google Chrome';
    } else if (/firefox|fxios/i.test(ua)) {
        browser = 'Mozilla Firefox';
    } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
        browser = 'Apple Safari';
    } else if (/msie|trident/i.test(ua)) {
        browser = 'Internet Explorer';
    } else if (device === 'Bot') {
        browser = 'Web Crawler / Bot';
    }

    // 3. Operating System Detection
    let os = 'Unknown OS';
    if (/windows nt 10.0/i.test(ua)) {
        os = 'Windows 10/11';
    } else if (/windows nt 6.3/i.test(ua)) {
        os = 'Windows 8.1';
    } else if (/windows nt 6.2/i.test(ua)) {
        os = 'Windows 8';
    } else if (/windows nt 6.1/i.test(ua)) {
        os = 'Windows 7';
    } else if (/windows/i.test(ua)) {
        os = 'Windows';
    } else if (/android/i.test(ua)) {
        os = 'Android';
    } else if (/iphone|ipad|ipod/i.test(ua)) {
        os = 'iOS';
    } else if (/macintosh|mac os x/i.test(ua)) {
        os = 'macOS';
    } else if (/cros/i.test(ua)) {
        os = 'Chrome OS';
    } else if (/linux/i.test(ua)) {
        os = 'Linux';
    }

    return { device, browser, os };
}

// In-memory GeoIP cache to avoid repeated lookups for the same IP
const geoCache = new Map();
const GEO_CACHE_MAX_SIZE = 1000;

// Resolve Geolocation information
async function resolveGeoLocation(ip, req) {
    // 1. Check CDN headers first (Cloudflare, Vercel, AWS CloudFront)
    if (req && req.headers) {
        const cdnCountry =
            req.headers['x-vercel-ip-country'] ||
            req.headers['cf-ipcountry'] ||
            req.headers['cloudfront-viewer-country'];
        const cdnCity =
            req.headers['x-vercel-ip-city'] ||
            req.headers['cf-ipcity'] ||
            req.headers['cloudfront-viewer-city'];
        const cdnRegion =
            req.headers['x-vercel-ip-country-region'] ||
            req.headers['cloudfront-viewer-country-region-name'];

        if (cdnCountry && cdnCountry !== 'XX' && cdnCountry !== 'T1') {
            return {
                country: cdnCountry,
                countryCode: cdnCountry.toUpperCase(),
                city: cdnCity ? decodeURIComponent(cdnCity) : 'Unknown',
                region: cdnRegion ? decodeURIComponent(cdnRegion) : 'Unknown',
                timezone: req.headers['x-vercel-ip-timezone'] || 'UTC',
                isp: 'CDN Edge Node',
            };
        }
    }

    // 2. Check Local/Private IP
    if (isPrivateIp(ip)) {
        return {
            country: 'Local Development',
            countryCode: 'LOC',
            city: 'Localhost',
            region: 'Internal Network',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            isp: 'Localhost / Private Network',
        };
    }

    // 3. Check memory cache
    if (geoCache.has(ip)) {
        return geoCache.get(ip);
    }

    // 4. Fast non-blocking lookup with timeout via free IP service
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout

        const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,countryCode,regionName,city,timezone,isp`, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            if (data && data.status === 'success') {
                const geoData = {
                    country: data.country || 'Unknown',
                    countryCode: (data.countryCode || 'UN').toUpperCase(),
                    city: data.city || 'Unknown',
                    region: data.regionName || 'Unknown',
                    timezone: data.timezone || 'UTC',
                    isp: data.isp || '',
                };

                // Limit cache size
                if (geoCache.size >= GEO_CACHE_MAX_SIZE) {
                    const firstKey = geoCache.keys().next().value;
                    if (firstKey) geoCache.delete(firstKey);
                }
                geoCache.set(ip, geoData);
                return geoData;
            }
        }
    } catch (err) {
        // Silently fallback without breaking tracking request
    }

    // Default fallback
    return {
        country: 'Unknown',
        countryCode: 'UN',
        city: 'Unknown',
        region: 'Unknown',
        timezone: 'UTC',
        isp: '',
    };
}

module.exports = {
    extractClientIp,
    isPrivateIp,
    parseUserAgent,
    resolveGeoLocation,
};
