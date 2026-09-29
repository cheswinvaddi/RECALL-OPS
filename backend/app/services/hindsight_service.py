import os
from hindsight_client import Hindsight


class HindsightService:
    def __init__(self):
        base_url = os.getenv("HINDSIGHT_BASE_URL", "http://localhost:8888")
        api_key = os.getenv("HINDSIGHT_API_KEY")
        self.client = Hindsight(
            base_url=base_url,
            api_key=api_key,
        )

    def recall(self, bank_id: str, query: str):
        return self.client.recall(
            bank_id=bank_id,
            query=query,
        )

    def reflect(self, bank_id: str, query: str):
        return self.client.reflect(
            bank_id=bank_id,
            query=query,
            budget="low",
            max_tokens=300,
            fact_types=["world", "experience"],
            exclude_mental_models=True,
            reflect_search_observations_include_entities=False,
            include_facts=True,
        )
