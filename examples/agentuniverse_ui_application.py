from agentuniverse.base.agentuniverse import AgentUniverse
from agentuniverse_product.agentuniverse_product import AgentUniverseProduct
import sys

print(sys.path)


class ProductApplication:
    """
    Product application.
    """

    @classmethod
    def start(cls):
        AgentUniverse().start()
        AgentUniverseProduct().start()


if __name__ == "__main__":
    ProductApplication.start()
