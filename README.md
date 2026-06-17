# PropAI v2.0 - The Smart Property Platform

The UK's most advanced AI-powered property platform, built with the latest 2026 tech stack.

## Tech Stack

| Layer | Technology |
|---|---|
| JDK | 25 LTS (Eclipse Temurin) |
| Spring Boot | 4.1.0 |
| Spring Framework | 7.0.7 |
| Spring Cloud | 2025.0.1 |
| Kafka | 4.x KRaft (no ZooKeeper) |
| MongoDB | 7.0 |
| Redis | 7.4 |
| Elasticsearch | 8.15 |
| React | 18 |
| Kubernetes | HPA + KRaft StatefulSet |

## Microservices

| Service | Port | Description |
|---|---|---|
| eureka-server | 8761 | Service registry |
| api-gateway | 8080 | Spring Cloud Gateway + JWT + rate limiting |
| property-service | 8081 | Listings CRUD + MongoDB + Kafka |
| user-service | 8082 | Auth + JWT + profiles |
| search-service | 8083 | Elasticsearch full-text search |
| enquiry-service | 8084 | Lead management |
| ai-chat-service | 8085 | Claude AI chatbot + WebSocket + agent handover |
| analytics-service | 8086 | Market trends + price index |
| notification-service | 8087 | Email (SendGrid) + Kafka consumer |

## Quick Start

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env — set ANTHROPIC_API_KEY at minimum

# 2. Start the full stack
docker-compose up -d

# 3. Wait ~3 minutes for all services to start
docker-compose ps

# 4. Open PropAI
open http://localhost:3000
```

## Access Points

| Service | URL |
|---|---|
| PropAI Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8080 |
| Eureka Dashboard | http://localhost:8761 |
| Kafka UI (KRaft) | http://localhost:8090 |
| Grafana | http://localhost:3001 (admin / propai_grafana) |
| Prometheus | http://localhost:9090 |
| Jaeger Tracing | http://localhost:16686 |
| Elasticsearch | http://localhost:9200 |

## Kafka Topics (KRaft - no ZooKeeper)

| Topic | Partitions | Producer | Consumers |
|---|---|---|---|
| property.events | 6 | property-service | search-service, analytics-service |
| enquiry.created | 3 | enquiry-service | notification-service, analytics-service |
| chat.handover | 3 | ai-chat-service | notification-service |
| notification.send | 3 | all services | notification-service |
| analytics.events | 6 | all services | analytics-service |

## AI Chatbot

The chatbot uses Claude claude-sonnet-4-6 via the Anthropic API.
Set ANTHROPIC_API_KEY in your .env file to enable AI responses.

Without an API key, the chatbot still works but shows a placeholder message.

Agent handover is triggered automatically when the user asks to speak with
a human agent. The event is published to the chat.handover Kafka topic and
broadcast to the agent dashboard via WebSocket.

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...    # Required for AI chatbot
JWT_SECRET=...                  # Min 64 chars random string
SENDGRID_API_KEY=SG....         # Optional - email notifications
GRAFANA_PASSWORD=...            # Optional - defaults to propai_grafana
```

## Docker Compose Notes

- First build takes 10-15 min (JDK 25 image download + Maven dependency resolution)
- Subsequent builds are fast due to Docker layer caching
- Run `docker-compose down --remove-orphans && docker builder prune -f` for a clean restart

## Kubernetes Deployment

```bash
# Build and push images
docker build -t propai/property-service:2.0.0 ./backend/property-service
docker push propai/property-service:2.0.0

# Create secrets
kubectl create secret generic propai-secrets \
  --from-literal=mongodb-uri="mongodb+srv://..." \
  --from-literal=jwt-secret="..." \
  --from-literal=anthropic-api-key="sk-ant-..." \
  --from-literal=kafka-cluster-id="MkU3OEVBNTcwNTJENDM2Qk" \
  -n propai

# Deploy
kubectl apply -f infrastructure/kubernetes/
```

## Project Structure

```
propai-final/
├── backend/
│   ├── Dockerfile               # Shared JDK 25 multi-stage build
│   ├── eureka-server/           # Service registry
│   ├── api-gateway/             # Spring Cloud Gateway
│   ├── property-service/        # Full CRUD + Kafka + MongoDB
│   ├── user-service/            # JWT auth + profiles
│   ├── search-service/          # Elasticsearch
│   ├── enquiry-service/         # Lead management
│   ├── ai-chat-service/         # Claude AI + WebSocket
│   ├── analytics-service/       # Market intelligence
│   └── notification-service/    # Email + Kafka consumer
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Hero, PropertyCard, Chatbot, Mortgage
│   │   ├── pages/               # Home, Search, Property, Rent, Analytics, Login...
│   │   ├── store/               # Redux - auth, saved, ui
│   │   └── utils/               # API client, formatters
│   ├── Dockerfile
│   └── nginx.conf
├── infrastructure/
│   ├── kubernetes/              # Deployments, Services, HPA, Ingress
│   ├── prometheus.yml
│   └── scripts/mongo-init.js
├── docker-compose.yml
└── .env.example
```
