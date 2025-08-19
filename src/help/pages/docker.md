# Docker - Container Platform

Sigao installs Docker CE with Docker Compose for containerized development.

## Docker Aliases

| Alias | Command | Description |
|-------|---------|-------------|
| `d` | `docker` | Docker command |
| `dc` | `docker-compose` | Docker Compose |
| `dps` | `docker ps` | List running containers |
| `dpsa` | `docker ps -a` | List all containers |
| `dim` | `docker images` | List images |
| `dex` | `docker exec -it` | Execute in container |
| `dlog` | `docker logs -f` | Follow logs |
| `dprune` | `docker system prune -a` | Clean everything |

## Basic Docker Commands

### Container Management
```bash
# Run container
docker run -d --name myapp nginx

# Run with port mapping
docker run -d -p 8080:80 nginx

# Run interactively
docker run -it ubuntu bash

# Stop/Start/Restart
docker stop myapp
docker start myapp
docker restart myapp

# Remove container
docker rm myapp
docker rm -f myapp  # Force
```

### Image Management
```bash
# Pull image
docker pull ubuntu:22.04

# List images
dim  # or docker images

# Remove image
docker rmi ubuntu:22.04

# Build image
docker build -t myapp:latest .

# Tag image
docker tag myapp:latest myapp:v1.0
```

### Executing Commands
```bash
# Execute in running container
dex myapp bash
docker exec -it myapp /bin/bash

# Run command and exit
docker exec myapp ls -la

# As different user
docker exec -u root myapp bash
```

## Docker Compose

### Basic docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Compose Commands
```bash
# Start services
dc up -d

# View logs
dc logs -f
dc logs -f web  # Specific service

# Stop services
dc down

# Rebuild
dc build
dc up -d --build

# Scale service
dc up -d --scale web=3
```

## Dockerfile Best Practices

### Node.js Example
```dockerfile
FROM node:18-alpine

# Install dependencies first (cache layer)
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copy app files
COPY . .

# Non-root user
USER node

# Start app
CMD ["node", "index.js"]
```

### Multi-stage Build
```dockerfile
# Build stage
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]
```

## Volumes

### Named Volumes
```bash
# Create volume
docker volume create mydata

# Use in run
docker run -v mydata:/data myapp

# List volumes
docker volume ls

# Inspect volume
docker volume inspect mydata

# Remove volume
docker volume rm mydata
```

### Bind Mounts
```bash
# Mount current directory
docker run -v $(pwd):/app myapp

# Read-only mount
docker run -v $(pwd):/app:ro myapp
```

## Networks

```bash
# Create network
docker network create mynet

# Run container in network
docker run -d --network mynet --name web nginx

# Connect running container
docker network connect mynet myapp

# List networks
docker network ls
```

## Resource Limits

```bash
# Limit memory and CPU
docker run -d \
  --memory="512m" \
  --cpus="0.5" \
  myapp

# In docker-compose.yml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## Debugging

### Logs
```bash
# View logs
dlog myapp

# Last 100 lines
docker logs --tail 100 myapp

# Since timestamp
docker logs --since 2023-01-01 myapp
```

### Inspect
```bash
# Container details
docker inspect myapp

# Specific field
docker inspect -f '{{.NetworkSettings.IPAddress}}' myapp

# Environment variables
docker inspect myapp | jq '.[0].Config.Env'
```

### Stats
```bash
# Resource usage
docker stats

# Specific container
docker stats myapp
```

## Cleanup Commands

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything unused
dprune  # or docker system prune -a

# Remove volumes
docker volume prune
```

## Security Best Practices

### Dockerfile
```dockerfile
# Don't run as root
USER node

# Don't expose unnecessary ports
EXPOSE 3000

# Use specific versions
FROM node:18.17.0-alpine

# Scan for vulnerabilities
# docker scan myapp:latest
```

### Runtime
```bash
# Read-only root filesystem
docker run --read-only myapp

# Drop capabilities
docker run --cap-drop=ALL myapp

# No new privileges
docker run --security-opt=no-new-privileges myapp
```

## Docker in WSL

Sigao configures Docker Desktop integration:
- Docker commands work in WSL
- Volumes mount correctly
- Performance optimized

### WSL Tips
```bash
# Use WSL paths for volumes
docker run -v /home/user/project:/app myapp

# Not Windows paths
# docker run -v C:\Users\...:app  # Don't do this
```

## Common Patterns

### Development Environment
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

### Database Backup
```bash
# Backup PostgreSQL
docker exec db pg_dump -U user dbname > backup.sql

# Restore
docker exec -i db psql -U user dbname < backup.sql
```

## Tips & Tricks

1. **Layer caching**: Order Dockerfile commands by change frequency
2. **Multi-stage**: Use for smaller production images
3. **Health checks**: Add HEALTHCHECK to Dockerfile
4. **Labels**: Add metadata with LABEL
5. **.dockerignore**: Exclude files from build context

## See Also

- `sigao help aliases` - Docker aliases
- Docker docs: https://docs.docker.com/
- Docker Hub: https://hub.docker.com/