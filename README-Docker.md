# 🐳 SADCOIN Frontend Docker Deployment Guide

This guide will help you deploy the SADCOIN Frontend to your Linode VPS using Docker.

## 📋 Prerequisites

- Docker and Docker Compose installed on your Linode VPS
- WalletConnect Project ID
- Google Gemini API Key

## 🚀 Quick Deployment

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sadcoin-email
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp env.example .env
nano .env  # or use your preferred editor
```

Required environment variables:

- `NEXT_PUBLIC_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
- `GOOGLE_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 3. Deploy

Make the deployment script executable and run it:

```bash
chmod +x deploy.sh
./deploy.sh
```

The application will be available at `http://your-server-ip:3000`

## 🔧 Manual Deployment

If you prefer to run commands manually:

```bash
# Build and start the container
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## 📊 Managing the Application

### View Logs
```bash
docker-compose logs -f sadcoin-frontend
```

### Restart the Application
```bash
docker-compose restart sadcoin-frontend
```

### Update the Application
```bash
git pull origin main
docker-compose up --build -d
```

### Stop the Application
```bash
docker-compose down
```

## 🌐 Nginx Reverse Proxy (Recommended)

For production deployment, set up Nginx as a reverse proxy:

### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 2. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/sadcoin
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Enable the Site

```bash
sudo ln -s /etc/nginx/sites-available/sadcoin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Set Up SSL with Let's Encrypt (Optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔒 Security Considerations

1. **Firewall**: Configure UFW to only allow necessary ports
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

2. **Environment Variables**: Never commit your `.env` file to version control

3. **Regular Updates**: Keep Docker and your system updated
   ```bash
   sudo apt update && sudo apt upgrade
   docker system prune -f
   ```

## 🐛 Troubleshooting

### Application Won't Start

1. Check logs:
   ```bash
   docker-compose logs sadcoin-frontend
   ```

2. Verify environment variables:
   ```bash
   cat .env
   ```

3. Check if port 3000 is available:
   ```bash
   sudo netstat -tlnp | grep :3000
   ```

### Build Failures

1. Clear Docker cache:
   ```bash
   docker system prune -a
   ```

2. Rebuild from scratch:
   ```bash
   docker-compose build --no-cache
   ```

### Memory Issues

If you encounter memory issues during build, you can:

1. Add swap space to your VPS
2. Use a smaller Node.js image
3. Build on a more powerful machine and push to a registry

## 📈 Performance Optimization

### 1. Enable Docker BuildKit

Add to your `.bashrc` or `.profile`:

```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### 2. Use Multi-stage Build Caching

The Dockerfile is already optimized with multi-stage builds for smaller final images.

### 3. Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  sadcoin-frontend:
    # ... existing configuration
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

## 🔄 Backup and Recovery

### Backup Configuration

```bash
# Backup your environment and configuration
tar -czf sadcoin-backup-$(date +%Y%m%d).tar.gz .env docker-compose.yml
```

### Recovery

```bash
# Restore from backup
tar -xzf sadcoin-backup-YYYYMMDD.tar.gz
./deploy.sh
```

## 📞 Support

If you encounter issues:

1. Check the application logs
2. Verify all environment variables are set correctly
3. Ensure Docker and Docker Compose are properly installed
4. Check that ports 3000 is not being used by other services

---

**Happy Deploying! 😢💻** 