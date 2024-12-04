import sys
sys.path.append("/Users/johnny/Code/difizen/magent/packages/magent-ui-langchain/src")



import requests
from bs4 import BeautifulSoup
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain.agents import initialize_agent
from langchain.agents import AgentType
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.schema import Document

from magent_ui_langchain import launch

# 读取网页内容
def load_webpage(url: str):
    response = requests.get(url)
    response.raise_for_status()  # 确保请求成功
    soup = BeautifulSoup(response.text, 'html.parser')

    # 提取文本内容（可以根据需要调整）
    paragraphs = soup.find_all('p')
    text = "\n".join([para.get_text() for para in paragraphs])
    return text

# 读取网页链接
url = "https://medium.com/@libro.development/libro-a-customizable-ai-notebook-ab31bd4197b9"  # 替换为你想读取的网页链接
webpage_content = load_webpage(url)

from langchain.schema import Document

# 文本分割
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
chunks = text_splitter.split_text(webpage_content)

# 创建文档对象列表
documents = [Document(page_content=chunk) for chunk in chunks]

# 创建向量存储
embeddings = OpenAIEmbeddings()
vector_store = FAISS.from_documents(documents, embeddings)

# 创建一个RAG工具
@tool
def rag_query(query: str) -> str:
    """
    This function retrieves relevant information from the loaded webpage data
    and generates a response using the language model.

    :param query: The user's query
    :return: The generated response based on the retrieved information
    """
    # Assuming `vector_store` and `llm` are accessible in the scope
    relevant_docs = vector_store.similarity_search(query)
    context = "\n".join([doc.page_content for doc in relevant_docs])
    response = llm(f"{context}\n\nUser: {query}\nAssistant:")
    return response

# 设置语言模型
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

# 定义工具
tools = [rag_query]

# 初始化代理
agent = initialize_agent(
    tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)



launch(agent)
