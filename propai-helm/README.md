Both renders are exactly right — the secret management is correct and dev/prod are cleanly separated:
Dev (helm template propai ./propai-helm):
kind: Secret
Only the inline Secret. No ESO resources. ✓
Prod (with -f values-production.yaml):
kind: ServiceAccount
kind: ExternalSecret
kind: SecretStore
kind: SecretStore
The ESO trio — ServiceAccount (IRSA), ExternalSecret, SecretStore — and crucially no kind: Secret (the inline one is correctly guarded off). ✓
Both grep -n "^externalSecrets:" returned line numbers (143 in values, 118 in prod), confirming the indentation fix landed at column 0. This is precisely the design goal: dev uses an inline secret, prod sources everything from AWS SSM via ESO, and the Deployments' secretKeyRef: propai-secrets works identically either way because both paths produce a Secret with that name. Secret management is done and correct.
Now the last piece — the README documenting deployment prerequisites and the follow-ups we flagged. Create propai-helm/README.md in the editor:
markdown# PropAI Helm Chart

Deploys the PropAI platform (Spring Boot microservices, Kafka KRaft, MongoDB, Redis) to Kubernetes.

## Layout

- `values.yaml` — dev defaults. Core services only; ingress, TLS, and external-secrets disabled. Uses locally-built images and an inline Secret.
- `values-production.yaml` — EKS overlay. GHCR images, all services enabled with replicas/HPA sizing, ingress + TLS on, secrets sourced from AWS SSM via External Secrets Operator.

## Local development (Docker Desktop Kubernetes)

Build images with compose first (the chart references `propai-final-*:latest`), then:

```bash
helm install propai ./propai-helm -n propai --create-namespace
kubectl get pods -n propai -w
```

Access via port-forward (no ingress locally):

```bash
kubectl port-forward -n propai svc/api-gateway 8080:8080
```

To enable more services locally, flip their `enabled` flag in `values.yaml`. Note the core set is memory-tuned for a 12GB Docker Desktop VM; enabling everything requires more.

## Production deployment (EKS)

```bash
helm install propai ./propai-helm \
  -f propai-helm/values.yaml \
  -f propai-helm/values-production.yaml \
  -n propai --create-namespace
```

### Prerequisites

**1. AWS Load Balancer Controller** — for the ALB/nginx ingress.
Install via Helm and ensure it has an IAM policy for ELB management. The ingress uses `ingressClassName: nginx`; install the nginx ingress controller, or switch the class to `alb` and adjust annotations if using AWS LB Controller directly.

**2. cert-manager** — for automatic TLS.
The ingress annotates `cert-manager.io/cluster-issuer: letsencrypt-prod`. Install cert-manager and create a `ClusterIssuer` named `letsencrypt-prod` before deploying, or TLS certs won't be issued.

**3. External Secrets Operator (ESO)** — for SSM-sourced secrets.
Install ESO into the cluster:

```bash
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets --create-namespace
```

**4. IRSA (IAM Roles for Service Accounts)** — so ESO can read SSM without static credentials.
- Ensure the EKS cluster has an OIDC provider enabled.
- Create an IAM role trusting the cluster OIDC provider, scoped to the `propai-external-secrets` ServiceAccount in the `propai` namespace.
- Grant it `ssm:GetParameter`/`GetParametersByPath` on `arn:aws:ssm:eu-west-2:<ACCOUNT>:parameter/propai/prod/*`.
- Put the role ARN into `values-production.yaml` → `externalSecrets.irsaRoleArn`.

**5. Populate SSM Parameter Store** (region `eu-west-2`, prefix `/propai/prod`):
/propai/prod/jwt-secret
/propai/prod/anthropic-api-key
/propai/prod/redis-password
/propai/prod/mongodb-uri-property-service
/propai/prod/mongodb-uri-user-service
/propai/prod/mongodb-uri-enquiry-service
/propai/prod/mongodb-uri-ai-chat-service
/propai/prod/mongodb-uri-analytics-service

Store these as `SecureString`. ESO syncs them into the `propai-secrets` k8s Secret every `refreshInterval` (default 1h).

## Known follow-ups (not yet in the chart)

- **Multi-node Kafka**: `values-production.yaml` sets `kafka.replicas: 3`, but `templates/kafka.yaml` is hardcoded single-node (`KAFKA_CONTROLLER_QUORUM_VOTERS: 1@localhost:9093`). A 3-node cluster needs a StatefulSet with a headless service and per-pod quorum voters. Until then, prod runs single-node Kafka.
- **Elasticsearch**: `search-service` is enabled in prod and expects `elasticsearch:9200`, but there is no Elasticsearch template in the chart. Either add an Elasticsearch StatefulSet or keep `search-service` disabled in prod.
- **ai-chat AI key**: chat returns a graceful "configure ANTHROPIC_API_KEY" message until a real key is provided (via SSM in prod, or `secrets.anthropicApiKey` in dev).

## Notes

- Helm does **not** merge lists. `springServices` in `values-production.yaml` is the complete list, not a partial override — changes to the base list must be mirrored there.
- ai-chat-service runs as a reactive (WebFlux) app; its image bakes in `spring.main.web-application-type=reactive` and reactive Spring Security. Do not copy servlet security config into it.