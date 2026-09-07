# Smart Campus RAG Knowledge Base

This directory contains a complete, modular, and pre-indexed knowledge base covering the entire **Bannari Amman Institute of Technology (BIT)** campus navigation, buildings, rooms, facilities, high-value assets, booking workflows, GIS routing algorithms, and emergency services.

---

## 📂 Directory Structure

| File | Purpose | Recommended Chunking Strategy |
|---|---|---|
| [`01_campus_overview.md`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/01_campus_overview.md) | Institution profile, gate coordinates, emergency hotlines, operating hours, IT infrastructure. | Heading-based chunks (~300-500 tokens) |
| [`02_buildings_directory.md`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/02_buildings_directory.md) | Full directory of 25 campus buildings with codes, coordinates, floors, departments & key facilities. | 1 Chunk per Building block |
| [`03_rooms_and_labs_directory.md`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/03_rooms_and_labs_directory.md) | Floor-by-floor mapping of classrooms, AI Lab, HPC, Wind Tunnel, Robotics Lab, and Seminar Halls. | Section/Table-based chunks |
| [`04_facilities_and_amenities.md`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/04_facilities_and_amenities.md) | Hostels (Boys & Girls), Guest House, Cafeteria & Food Courts, 24/7 Medical Clinic, Sports Arenas. | 1 Chunk per Facility section |
| [`05_asset_and_equipment_catalog.md`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/05_asset_and_equipment_catalog.md) | Reserveable assets (MacBook Pro M3, Meta Quest 3 VR, DJI Mavic 3 Drone, 3D Printers, Projectors). | 1 Chunk per Asset unit |
| [`06_booking_and_reservation_rules.md`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/06_booking_and_reservation_rules.md) | Role permissions (Student vs Faculty vs Admin), QR code verification, 15-min grace period, auto-release. | Policy-based chunks |
| [`07_navigation_and_gis_routing.md`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/07_navigation_and_gis_routing.md) | Dijkstra 320-junction graph algorithm, Walk/Drive modes, wall-avoidance, indoor floor wayfinding, wheelchair access. | Topic-based chunks |
| [`08_events_and_campus_life.md`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/08_events_and_campus_life.md) | National Hackathons, AI Symposia, Inter-College Sports Leagues, GDSC, Robotics Club, Lost & Found. | Event-based chunks |
| [`09_campus_faqs_and_qna.md`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/09_campus_faqs_and_qna.md) | Curated question-and-answer pairs across all campus domains for instant similarity matching. | 1 Chunk per Q&A pair |
| [`10_rag_chunks_metadata.json`](file:///c:/Users/mridulverma/OneDrive/Desktop/navigation_app2/campus_knowledge_base/10_rag_chunks_metadata.json) | Machine-readable JSON corpus with chunk IDs, tags, coordinates, and keywords for vector database loaders. | Ingest directly into Vector Store |

---

## 🛠️ How to Ingest into a RAG Pipeline

### Option A: Python (LangChain + ChromaDB / FAISS)

```python
import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. Load Markdown Knowledge Base Files
loader = DirectoryLoader(
    path="./campus_knowledge_base",
    glob="*.md",
    loader_cls=TextLoader
)
raw_docs = loader.load()

# 2. Split into Semantic Chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=80,
    separators=["\n---\n", "\n### ", "\n## ", "\n\n", "\n", " "]
)
documents = text_splitter.split_documents(raw_docs)

# 3. Generate Vector Embeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(documents, embeddings, persist_directory="./campus_chroma_db")
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# 4. Define Campus Chatbot Prompt
system_prompt = (
    "You are the BIT Smart Campus AI Navigator & Assistant. "
    "Use the following retrieved campus knowledge context to answer questions accurately. "
    "If you do not know the answer from the context, guide the user to the Help Desk or Security SOS at Ext 6000.\n\n"
    "Context:\n{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# 5. Query the RAG Chatbot
response = rag_chain.invoke({"input": "Where is the AI Lab and what are the opening hours?"})
print(response["answer"])
```

---

### Option B: Node.js / Express Backend Integration

```javascript
import fs from 'fs';
import path from 'path';

// Load pre-indexed JSON metadata chunks
const metadataPath = path.join(__dirname, '../campus_knowledge_base/10_rag_chunks_metadata.json');
const campusCorpus = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

console.log(`Loaded ${campusCorpus.total_chunks} indexed campus knowledge chunks for RAG processing.`);
```
