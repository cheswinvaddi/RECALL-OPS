import os
from hindsight_client import Hindsight

base_url = os.getenv("HINDSIGHT_BASE_URL", "http://localhost:8888")
api_key = os.getenv("HINDSIGHT_API_KEY")
bank_id = "recall-ops-test"

INCIDENTS = [
    {
        "document_id": "nexora-incident-payment-504-db-latency",
        "service": "payment-service",
        "context": "NEXORA Production Postmortem - payment-service 504 Timeout",
        "tags": ["incident", "payment-service", "504", "database-latency", "resolved", "successful", "postmortem"],
        "content": """Company: NEXORA
Service: payment-service

Incident:
During peak checkout and payment traffic, payment-service began experiencing high error rates and latency spikes, returning HTTP 504 Gateway Timeout errors.

Symptoms:
- HTTP 504 Gateway Timeout errors on payment endpoints.
- Database query latency increased significantly across transaction tables.
- Multiple downstream payment authorization requests timed out before completion.

Root cause:
A slow database query scanning unindexed transaction records caused severe query latency and database connection bottlenecks during peak traffic.

Actions taken:
1. Identified slow-running queries via database performance insights.
2. Created a missing composite database index on transaction lookup columns.
3. Optimized query execution plans.

Resolution:
Added the missing database index and deployed query optimization.

Outcome:
Successful. Query execution times dropped from several seconds to under 15ms, HTTP 504 errors ceased, and payment processing latency normalized.

Important lesson:
When payment-service shows 504 Gateway Timeout errors accompanied by database query latency, inspect slow queries and database indexes before attempting to scale application instances.""",
    },
    {
        "document_id": "nexora-incident-auth-slow-token-validation",
        "service": "auth-service",
        "context": "NEXORA Production Postmortem - auth-service Token Validation Latency",
        "tags": ["incident", "auth-service", "latency", "token-validation", "caching", "resolved", "successful", "postmortem"],
        "content": """Company: NEXORA
Service: auth-service

Incident:
User login and API request authentication experienced severe latency degradation while CPU and memory utilization on auth-service pods remained normal.

Symptoms:
- Login requests became abnormally slow across all client applications.
- Authentication latency increased to over 3 seconds per request.
- Host CPU and memory pressure remained completely normal and within healthy thresholds.

Root cause:
An external token-validation dependency was suffering from high latency and rate saturation, bottlenecking synchronous validation calls.

Actions taken:
1. Monitored external upstream service response latencies.
2. Verified that local compute resources were idle while waiting on upstream token validation.
3. Enabled short-lived in-memory caching for valid token validation results.

Resolution:
Enabled short-lived caching for token validation responses to avoid redundant upstream calls.

Outcome:
Successful. Authentication latency immediately returned to sub-50ms, and dependency traffic dropped by 80%.

Important lesson:
When auth latency rises without corresponding CPU or memory pressure, inspect external authentication dependencies and token-validation latency rather than adding more application instances.""",
    },
    {
        "document_id": "nexora-incident-order-500-serialization-rollback",
        "service": "order-service",
        "context": "NEXORA Production Postmortem - order-service 500 Deployment Rollback",
        "tags": ["incident", "order-service", "500", "deployment", "serialization", "rollback", "resolved", "successful", "postmortem"],
        "content": """Company: NEXORA
Service: order-service

Incident:
Immediately following a scheduled release, order-service began throwing HTTP 500 errors on order creation and retrieval endpoints.

Symptoms:
- HTTP 500 Internal Server Errors began immediately after deployment release.
- Application error rates jumped from 0.01% to 45% within minutes of rollout.
- Application logs showed an unhandled serialization exception during payload generation.

Root cause:
A newly deployed application version introduced an incompatible response serialization schema change that failed against legacy order data.

Actions taken:
1. Cross-referenced the error timeline with the deployment pipeline timestamp.
2. Identified an incompatible field serialization change in the latest release commit.
3. Executed an immediate rollback to the previous stable release.

Resolution:
Rolled back the deployment to the previous stable release version.

Outcome:
Successful. Errors stopped immediately following the rollback, and order submission resumed normal operation.

Important lesson:
When order-service errors begin immediately after a deployment, compare the incident timeline with the release and inspect the new version before modifying infrastructure.""",
    },
    {
        "document_id": "nexora-incident-checkout-503-pod-restart-pool-exhaustion",
        "service": "checkout-service",
        "context": "NEXORA Production Postmortem - checkout-service 503 Pod Restart Mitigation Failure",
        "tags": ["incident", "checkout-service", "503", "db-connection-pool", "pod-restart", "failed-mitigation", "resolved", "successful", "postmortem"],
        "content": """Company: NEXORA
Service: checkout-service

Incident:
During elevated traffic, checkout-service intermittently returned HTTP 503 errors and experienced database connection acquisition delays despite pods reporting healthy.

Symptoms:
- HTTP 503 Service Unavailable errors on checkout flow.
- Database connection acquisition delays observed in application metrics.
- Application pods appeared healthy and passed Kubernetes readiness probes.

Initial action:
Restarted all checkout-service application pods.

Initial outcome:
Unsuccessful. HTTP 503 errors briefly subsided during restart but quickly returned once traffic ramped back up.

Root cause:
Database connection-pool exhaustion. The maximum pool size was constrained to 10 connections, starving concurrent checkout requests.

Actions taken:
1. Evaluated connection-pool saturation metrics and active vs. idle connection gauges.
2. Determined that restarting pods did not fix the connection bottleneck.
3. Increased the database connection pool limit from 10 to 50 connections.

Resolution:
Increased database connection pool maximum from 10 to 50 connections.

Outcome:
Successful. HTTP 503 errors ceased, connection acquisition delays were eliminated, and checkout throughput stabilized.

Important lesson:
Restarting healthy application pods does not solve recurring checkout-service 503s caused by database connection-pool exhaustion. Inspect connection-pool metrics first.""",
    },
]


def seed_incidents():
    client = Hindsight(base_url=base_url, api_key=api_key)

    print(f"Connecting to Hindsight at {base_url} (bank: '{bank_id}')...")

    # Fetch existing document IDs for idempotency
    existing_memories = client.list_memories(bank_id=bank_id)
    existing_doc_ids = {
        m.document_id for m in getattr(existing_memories, "items", []) if getattr(m, "document_id", None)
    }

    added_count = 0
    for inc in INCIDENTS:
        doc_id = inc["document_id"]
        if doc_id in existing_doc_ids:
            print(f"Skipping '{doc_id}': already present in bank '{bank_id}'.")
            continue

        print(f"Retaining incident '{doc_id}' ({inc['service']})...")
        res = client.retain(
            bank_id=bank_id,
            content=inc["content"],
            document_id=doc_id,
            context=inc["context"],
            tags=inc["tags"],
        )
        print(f"  -> Retain result for '{doc_id}': success={res.success}")
        added_count += 1

    print(f"\nFinished seeding. Total new incidents added: {added_count}")
    client.close()


if __name__ == "__main__":
    seed_incidents()
