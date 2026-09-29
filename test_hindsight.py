"""
Working Hindsight Reflect Configuration:
- Hindsight API version: 0.10.1
- Groq provider: groq
- Groq model: openai/gpt-oss-20b
- budget: low
- max_tokens: 300
- fact_types: ["world", "experience"]
- exclude_mental_models: True
- reflect_search_observations_include_entities: False
- include_facts: True
"""

import os
from hindsight_client import Hindsight

base_url = os.getenv("HINDSIGHT_BASE_URL", "http://localhost:8888")
api_key = os.getenv("HINDSIGHT_API_KEY")
bank_id = "recall-ops-test"

client = Hindsight(
    base_url=base_url,
    api_key=api_key,
)

print(f"Hindsight client initialized successfully with base URL: {base_url}")

try:
    # Ensure bank exists (create only if necessary)
    try:
        client.get_bank_config(bank_id=bank_id)
        print(f"Bank '{bank_id}' verified.")
    except Exception as e:
        if "404" in str(e):
            print(f"Bank '{bank_id}' not found. Creating bank...")
            client.create_bank(bank_id=bank_id, name="Recall Ops Test Bank")
            print(f"Bank '{bank_id}' created successfully.")
        else:
            raise

    reflect_query = (
        "Based on previous NEXORA checkout-service incidents, what is the most likely "
        "root cause and recommended first diagnostic action when checkout-service "
        "experiences HTTP 503 errors together with database connection acquisition delays?"
    )

    print(f"\n--- Testing Hindsight Reflect ---")
    print(f"Bank: {bank_id}")
    print(f"Query: {reflect_query}\n")

    try:
        response = client.reflect(
            bank_id=bank_id,
            query=reflect_query,
            budget="low",
            max_tokens=300,
            include_facts=True,
            fact_types=["world", "experience"],
            exclude_mental_models=True,
            reflect_search_observations_include_entities=False,
        )
        print("Reflect completed successfully!\n")
        print("Answer:")
        print(response.text)
        if hasattr(response, "based_on") and response.based_on:
            memories = getattr(response.based_on, "memories", None) or []
            print(f"\nBased On ({len(memories)} memory/memories used):")
            for m in memories:
                print(f"- ID: {getattr(m, 'id', m)}")
                if hasattr(m, "text") and m.text:
                    print(f"  Snippet: {m.text[:120]}...")
    except Exception as e:
        print(f"Reflect request returned an error:\n{e}")

except Exception as e:
    print(f"Operation failed at {base_url}: {e}")
finally:
    client.close()