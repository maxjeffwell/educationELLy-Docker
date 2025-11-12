# Nginx Configuration

This directory contains the nginx reverse proxy configuration for production deployment.

## Files

- `nginx.conf` - Main nginx configuration file
- `ssl/` - Directory for SSL certificates (not tracked in git)

## SSL Certificate Setup

### Option 1: Let's Encrypt (Recommended for Production)

1. Install Certbot:
```bash
sudo apt-get update
sudo apt-get install certbot
```

2. Generate certificates:
```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

3. Copy certificates to nginx/ssl:
```bash
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

4. Set up auto-renewal:
```bash
sudo certbot renew --dry-run
```

### Option 2: Self-Signed Certificate (Development/Testing Only)

Generate a self-signed certificate for testing:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

**Note:** Browsers will show security warnings for self-signed certificates.

### Option 3: Custom Certificate

If you have certificates from another provider:

1. Copy your certificate and key:
```bash
cp your-certificate.crt nginx/ssl/cert.pem
cp your-private-key.key nginx/ssl/key.pem
```

2. If you have a certificate chain, combine them:
```bash
cat your-certificate.crt intermediate.crt > nginx/ssl/cert.pem
```

## Enabling HTTPS

After adding SSL certificates:

1. Edit `nginx/nginx.conf`
2. Uncomment the HTTPS server block (lines starting with `#     server {`)
3. Update `server_name` with your actual domain
4. Comment out or remove the HTTP-only location blocks
5. Restart nginx:
```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

## Configuration Details

### Rate Limiting

The configuration includes two rate limit zones:
- `api_limit`: 10 requests/second for API endpoints (burst: 20)
- `general_limit`: 100 requests/second for general traffic (burst: 50)

Adjust these in `nginx.conf` based on your needs.

### Compression

Gzip compression is enabled for:
- Text files (HTML, CSS, JavaScript)
- JSON and XML
- Fonts
- SVG images

### Security Headers

When HTTPS is enabled, these security headers are automatically added:
- `Strict-Transport-Security` - Force HTTPS
- `X-Frame-Options` - Prevent clickjacking
- `X-Content-Type-Options` - Prevent MIME sniffing
- `X-XSS-Protection` - XSS filter

### Health Check

The `/health` endpoint is always available and returns "healthy" with a 200 status code.

Test it:
```bash
curl http://localhost/health
```

## Troubleshooting

### Cannot start nginx container

**Issue:** Port 80 or 443 already in use

**Solution:**
```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :443

# Stop the conflicting service
sudo systemctl stop apache2  # if Apache is running
```

### SSL certificate errors

**Issue:** nginx fails to start with SSL errors

**Solution:**
1. Verify certificate files exist and have correct permissions:
```bash
ls -la nginx/ssl/
```

2. Test certificate:
```bash
openssl x509 -in nginx/ssl/cert.pem -text -noout
```

3. Check if key matches certificate:
```bash
openssl x509 -noout -modulus -in nginx/ssl/cert.pem | openssl md5
openssl rsa -noout -modulus -in nginx/ssl/key.pem | openssl md5
```

The MD5 hashes should match.

### 502 Bad Gateway

**Issue:** nginx returns 502 error

**Solution:**
1. Check if backend services are running:
```bash
docker-compose -f docker-compose.prod.yml ps
```

2. Check backend logs:
```bash
docker-compose -f docker-compose.prod.yml logs server
docker-compose -f docker-compose.prod.yml logs client
```

3. Verify network connectivity:
```bash
docker-compose -f docker-compose.prod.yml exec nginx ping server
docker-compose -f docker-compose.prod.yml exec nginx ping client
```

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/) - Test your SSL configuration
