const fs = require('fs');
const path = require('path');

class RagService {
  constructor() {
    this.knowledgeBaseDir = path.resolve(__dirname, '../../campus_knowledge_base');
    this.chunks = [];
    this.isInitialized = false;
    this.idfMap = new Map();
    this.init();
  }

  init() {
    try {
      this.loadKnowledgeBase();
      this.buildTfIdfIndex();
      this.isInitialized = true;
      console.log(`[RAG Service] Successfully initialized knowledge base with ${this.chunks.length} chunks.`);
    } catch (err) {
      console.error('[RAG Service] Error initializing knowledge base:', err.message);
    }
  }

  loadKnowledgeBase() {
    this.chunks = [];

    // 1. Ingest pre-indexed JSON metadata chunks if present
    const metadataJsonPath = path.join(this.knowledgeBaseDir, '10_rag_chunks_metadata.json');
    if (fs.existsSync(metadataJsonPath)) {
      try {
        const rawJson = JSON.parse(fs.readFileSync(metadataJsonPath, 'utf8'));
        if (Array.isArray(rawJson.documents)) {
          rawJson.documents.forEach((doc) => {
            this.chunks.push({
              id: doc.id,
              sourceFile: doc.source_file || '10_rag_chunks_metadata.json',
              category: doc.category || 'General',
              title: doc.title || 'Campus Information',
              keywords: doc.keywords || [],
              coordinates: doc.coordinates || null,
              contacts: doc.contacts || null,
              buildingCode: doc.building_code || null,
              text: doc.text || ''
            });
          });
        }
      } catch (e) {
        console.warn('[RAG Service] Warning reading 10_rag_chunks_metadata.json:', e.message);
      }
    }

    // 2. Ingest and parse all markdown files from campus_knowledge_base
    if (fs.existsSync(this.knowledgeBaseDir)) {
      const files = fs.readdirSync(this.knowledgeBaseDir).filter(f => f.endsWith('.md') && f !== 'README.md');
      for (const file of files) {
        const filePath = path.join(this.knowledgeBaseDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        this.parseMarkdownToChunks(file, content);
      }
    }
  }

  parseMarkdownToChunks(filename, content) {
    let defaultCategory = 'Campus General';
    if (filename.includes('overview')) defaultCategory = 'Campus Overview & Gates';
    else if (filename.includes('buildings')) defaultCategory = 'Buildings Directory';
    else if (filename.includes('rooms')) defaultCategory = 'Rooms & Academic Labs';
    else if (filename.includes('facilities')) defaultCategory = 'Facilities & Amenities';
    else if (filename.includes('asset')) defaultCategory = 'Assets & Equipment';
    else if (filename.includes('booking')) defaultCategory = 'Booking SOPs & Policies';
    else if (filename.includes('navigation')) defaultCategory = 'GIS Navigation & Routing';
    else if (filename.includes('events')) defaultCategory = 'Events & Campus Life';
    else if (filename.includes('faqs')) defaultCategory = 'Campus FAQs & Q&A';

    // Split on markdown headings (## or ###)
    const sections = content.split(/\n(?=##?\s+)/);
    sections.forEach((section, idx) => {
      const trimmed = section.trim();
      if (!trimmed || trimmed.length < 40) return;

      const lines = trimmed.split('\n');
      const headerLine = lines[0].replace(/^#+\s*/, '').trim();
      const body = lines.slice(1).join('\n').trim();

      // For FAQ files, split individual Q&A pairs
      if (filename.includes('faqs') && body.includes('**Q:')) {
        const qaPairs = body.split(/\n(?=\*\*Q:)/);
        qaPairs.forEach((qa, qaIdx) => {
          const qMatch = qa.match(/\*\*Q:\s*(.*?)\*\*/);
          const aMatch = qa.match(/\*\*A:\s*([\s\S]*)/);
          if (qMatch && aMatch) {
            const question = qMatch[1].trim();
            const answer = aMatch[1].trim();
            this.chunks.push({
              id: `${filename.replace('.md', '')}_qa_${qaIdx}`,
              sourceFile: filename,
              category: 'Curated FAQs',
              title: question,
              keywords: this.extractKeywords(question + ' ' + answer),
              text: `Question: ${question}\nAnswer: ${answer}`
            });
          }
        });
        return;
      }

      const buildingCodeMatch = trimmed.match(/`([A-Z0-9\-_]+)`/);
      const coordMatch = trimmed.match(/(\d{1,2}\.\d{4,6}),\s*(\d{1,2}\.\d{4,6})/);

      this.chunks.push({
        id: `${filename.replace('.md', '')}_sec_${idx}`,
        sourceFile: filename,
        category: defaultCategory,
        title: headerLine || `${defaultCategory} Section ${idx + 1}`,
        keywords: this.extractKeywords(headerLine + ' ' + body),
        coordinates: coordMatch ? { latitude: parseFloat(coordMatch[1]), longitude: parseFloat(coordMatch[2]) } : null,
        buildingCode: buildingCodeMatch ? buildingCodeMatch[1] : null,
        text: trimmed
      });
    });
  }

  extractKeywords(text) {
    const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const tokens = clean.split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));
    return Array.from(new Set(tokens)).slice(0, 20);
  }

  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !STOP_WORDS.has(t));
  }

  buildTfIdfIndex() {
    this.idfMap.clear();
    const docCount = this.chunks.length;
    if (docCount === 0) return;

    const termDocFreq = new Map();

    this.chunks.forEach((chunk) => {
      const fullContent = `${chunk.title} ${chunk.category} ${chunk.keywords.join(' ')} ${chunk.text}`;
      const tokens = new Set(this.tokenize(fullContent));
      tokens.forEach((term) => {
        termDocFreq.set(term, (termDocFreq.get(term) || 0) + 1);
      });
    });

    termDocFreq.forEach((freq, term) => {
      const idf = Math.log((docCount + 1) / (freq + 1)) + 1;
      this.idfMap.set(term, idf);
    });
  }

  expandQuerySynonyms(query) {
    const lower = query.toLowerCase();
    const additions = [];

    const synonymsMap = [
      { triggers: ['where', 'location', 'navigate', 'reach', 'find', 'direction', 'how to go'], words: ['navigation', 'gis', 'routing', 'coordinates', 'building'] },
      { triggers: ['ai lab', 'artificial intelligence'], words: ['sf block', 'computing', 'ground floor', 'it 101', 'it 102', 'gpu'] },
      { triggers: ['dijkstra', 'graph', 'roads', 'junction'], words: ['320 calibrated road junctions', 'avoid buildings', 'walk mode', 'drive mode'] },
      { triggers: ['macbook', 'laptop', 'apple', 'm3'], words: ['computer center', 'b-204', 'reserveable assets', 'equipment'] },
      { triggers: ['vr', 'virtual reality', 'quest'], words: ['meta quest 3', 'innovation lab', 'a-102'] },
      { triggers: ['drone', 'mavic'], words: ['dji mavic 3 pro', 'gis spatial analytics', 'certification'] },
      { triggers: ['3d print', 'printer'], words: ['ender 3 pro', 'maker studio', 'mechanical block'] },
      { triggers: ['emergency', 'ambulance', 'hospital', 'doctor', 'medical', 'sos', 'help'], words: ['ext 6000', 'ext 6111', 'ext 6222', 'med-ctr', 'medical center'] },
      { triggers: ['hostel', 'curfew', 'entry time', 'night', 'dorm'], words: ['boys hostel 09:30 pm', 'girls hostel 09:00 pm', 'curfew', 'turnstiles'] },
      { triggers: ['food', 'mess', 'cafeteria', 'canteen', 'eat'], words: ['central cafeteria', '07:00 am - 09:30 pm', 'food courts'] },
      { triggers: ['library', 'books', 'study', 'read'], words: ['central learning center', '07:00 am - 11:00 pm', 'lrn-ctr'] },
      { triggers: ['booking', 'reserve', 'qr code', 'grace period', 'cancel', 'no show'], words: ['15-minute grace period', 'digital qr pass', 'auto cancellation', 'door scanner'] },
      { triggers: ['sports', 'cricket', 'gym', 'badminton', 'track'], words: ['sports complex', 'athletic track', 'cricket ground', 'courts'] },
      { triggers: ['parking', 'car', 'bike', 'ev', 'vehicle'], words: ['bit-prk', 'main gate a', 'ev charging', 'two wheeler'] }
    ];

    synonymsMap.forEach(({ triggers, words }) => {
      if (triggers.some(t => lower.includes(t))) {
        additions.push(...words);
      }
    });

    return additions.join(' ');
  }

  retrieve(query, topK = 4) {
    if (!this.chunks.length) return [];

    const expandedQuery = `${query} ${this.expandQuerySynonyms(query)}`;
    const queryTokens = this.tokenize(expandedQuery);
    if (!queryTokens.length) {
      return this.chunks.slice(0, topK);
    }

    const queryLower = query.toLowerCase();

    const scored = this.chunks.map((chunk) => {
      let score = 0;
      const titleTokens = this.tokenize(chunk.title);
      const chunkTokens = this.tokenize(chunk.text);
      const keywordTokens = this.tokenize(chunk.keywords.join(' '));

      if (chunk.text.toLowerCase().includes(queryLower)) score += 8.0;
      if (chunk.title.toLowerCase().includes(queryLower)) score += 12.0;

      queryTokens.forEach((qToken) => {
        const idf = this.idfMap.get(qToken) || 1.0;
        const titleCount = titleTokens.filter(t => t === qToken).length;
        score += titleCount * idf * 4.0;

        const kwCount = keywordTokens.filter(t => t === qToken).length;
        score += kwCount * idf * 3.0;

        const bodyCount = chunkTokens.filter(t => t === qToken).length;
        score += bodyCount * idf * 1.0;
      });

      if (chunk.buildingCode && queryLower.includes(chunk.buildingCode.toLowerCase())) {
        score += 15.0;
      }

      return {
        chunk,
        score
      };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored
      .filter(item => item.score > 0.5)
      .slice(0, topK)
      .map(item => ({
        id: item.chunk.id,
        title: item.chunk.title,
        category: item.chunk.category,
        sourceFile: item.chunk.sourceFile,
        coordinates: item.chunk.coordinates,
        buildingCode: item.chunk.buildingCode,
        contacts: item.chunk.contacts,
        relevanceScore: Math.min(100, Math.round(item.score * 10) / 10),
        text: item.chunk.text,
        snippet: item.chunk.text.slice(0, 180).replace(/\n+/g, ' ') + '...'
      }));
  }

  detectLocation(query, retrieved = []) {
    const q = query.toLowerCase();

    const locationRules = [
      { keys: ['ai lab', 'artificial intelligence lab', 'sf block', 'sf academic', 'computer center', 'it lab', 'data science lab'], name: 'Artificial Intelligence Lab (SF Block)', code: 'sf-block-labs' },
      { keys: ['library', 'learning center', 'lrn-ctr', 'central library', 'study pod'], name: 'BIT Central Learning Center', code: 'library' },
      { keys: ['medical center', 'hospital', 'clinic', 'ambulance', 'doctor', 'med-ctr'], name: 'BIT Medical Center', code: 'medical-centre' },
      { keys: ['canteen', 'cafeteria', 'food court', 'mess', 'dining', 'bit-caf'], name: 'Central Cafeteria', code: 'canteen' },
      { keys: ['ib block', 'institution building', 'ece', 'eee', 'vlsi'], name: 'IB Academic Block', code: 'ib-block' },
      { keys: ['mech block', 'mechanical block', 'cnc', 'maker studio', 'robotics'], name: 'Mechanical Block', code: 'mechanical-block' },
      { keys: ['aero block', 'aeronautical block', 'wind tunnel', 'flight simulator'], name: 'Aeronautical Block', code: 'aero-block' },
      { keys: ['as block', 'applied science', 'physics lab', 'chemistry lab', 'maths'], name: 'Applied Science Block', code: 'as-block' },
      { keys: ['auditorium', 'vedhanayagam', 'convention hall', 'seminar hall'], name: 'Vedhanayagam Auditorium', code: 'auditorium' },
      { keys: ['boys hostel', 'hostel boys'], name: 'Boys Hostel Complex', code: 'boys-hostel' },
      { keys: ['girls hostel', 'hostel girls'], name: 'Girls Hostel Complex', code: 'girls-hostel' },
      { keys: ['hostel'], name: 'Campus Hostels', code: 'boys-hostel' },
      { keys: ['sports complex', 'cricket ground', 'athletic track', 'tennis', 'badminton', 'basketball', 'gym'], name: 'Campus Sports Arena & Grounds', code: 'sports-complex' },
      { keys: ['guest house', 'vip suite', 'visitors guest house'], name: 'BIT Guest House', code: 'guest-house' },
      { keys: ['main gate', 'gate a', 'entrance'], name: 'Main Gate A', code: 'main-gate' },
      { keys: ['gate c', 'west gate'], name: 'Gate C (West Entrance)', code: 'gate-c' },
      { keys: ['parking', 'ev charging', 'car park'], name: 'Central Parking & EV Bays', code: 'parking' }
    ];

    for (const rule of locationRules) {
      if (rule.keys.some(k => q.includes(k))) {
        return { name: rule.name, destination: rule.code };
      }
    }

    // Check retrieved chunks for building codes
    for (const chunk of retrieved) {
      if (chunk.buildingCode) {
        return {
          name: chunk.title.split('-')[0].trim(),
          destination: chunk.buildingCode.toLowerCase().replace(/_/g, '-')
        };
      }
    }

    return null;
  }

  detectSuggestedActions(query, retrieved) {
    const actions = [];
    const lower = query.toLowerCase();

    const loc = this.detectLocation(query, retrieved);
    if (loc) {
      actions.push({
        type: 'navigate',
        label: `🚀 Explore Route to ${loc.name}`,
        destination: loc.destination,
        placeName: loc.name,
        isExplorePrompt: true
      });
    }

    if (lower.includes('book') || lower.includes('reserve') || lower.includes('macbook') || lower.includes('lab') || lower.includes('room') || lower.includes('vr') || lower.includes('drone')) {
      actions.push({
        type: 'book',
        label: 'Open Facility & Asset Bookings',
        targetTab: 'Bookings'
      });
    }

    if (lower.includes('emergency') || lower.includes('doctor') || lower.includes('sos') || lower.includes('ambulance') || lower.includes('urgent') || lower.includes('hospital')) {
      actions.push({
        type: 'emergency',
        label: 'Call Emergency Desk (Ext 6000)',
        phone: '6000'
      });
    }

    return actions;
  }

  detectFollowUps(query, retrieved) {
    const lower = query.toLowerCase();
    const suggestions = [];

    if (lower.includes('ai lab') || lower.includes('sf block')) {
      suggestions.push('How do I book the AI Lab with GPU clusters?');
      suggestions.push('Where is the nearest parking to SF Block?');
      suggestions.push('What are the opening hours of SF Block labs?');
    } else if (lower.includes('book') || lower.includes('reserve') || lower.includes('pass') || lower.includes('grace period')) {
      suggestions.push('What happens if I am late for my booking?');
      suggestions.push('How many active bookings can a student have?');
      suggestions.push('How does the QR access pass work?');
    } else if (lower.includes('hostel') || lower.includes('curfew')) {
      suggestions.push('What are the cafeteria timings?');
      suggestions.push('Can parents stay on campus at the Guest House?');
      suggestions.push('What sports facilities are open late?');
    } else if (lower.includes('dijkstra') || lower.includes('route') || lower.includes('map') || lower.includes('navigation')) {
      suggestions.push('Are there wheelchair-accessible routes on campus?');
      suggestions.push('How many road network junctions are calibrated?');
      suggestions.push('How does Walk Mode differ from Drive Mode?');
    } else if (lower.includes('emergency') || lower.includes('medical')) {
      suggestions.push('What is the ambulance dispatch number?');
      suggestions.push('Where is the Medical Center located on the map?');
      suggestions.push('Is the campus pharmacy open 24/7?');
    } else {
      suggestions.push('Where is the AI Lab located?');
      suggestions.push('What are the hostel curfew hours?');
      suggestions.push('How do I reserve high-value assets like MacBook Pro?');
    }

    return suggestions.slice(0, 3);
  }

  synthesizeAnswer(query, retrievedChunks) {
    if (!retrievedChunks.length) {
      return {
        answer: "I couldn't find specific information in the campus knowledge base regarding your query. For direct assistance, please contact the Campus Help Desk or Campus Security Emergency SOS at Ext 6000 / 6111.",
        sources: [],
        suggestedActions: [
          { type: 'emergency', label: 'Call Campus Help Desk (Ext 6000)', phone: '6000' }
        ],
        suggestedFollowUps: ['Where is the AI Lab?', 'What are the hostel curfews?', 'How do I book a classroom?']
      };
    }

    const primary = retrievedChunks[0];
    const secondary = retrievedChunks[1];

    let answerText = '';
    const qLower = query.toLowerCase();

    if (qLower.includes('ai lab') || (qLower.includes('artificial intelligence') && qLower.includes('lab'))) {
      answerText = `📍 **Artificial Intelligence Lab (AI Lab)** is located on the **Ground Floor (Floor 1)** of the **SF Academic Block (\`SF-BLK\`)**.\n\n` +
        `• **Directions:** Enter the SF Block main lobby, walk down the central hallway, and the AI Lab is on your left, adjacent to Room IT 102.\n` +
        `• **Equipment:** Equipped with high-performance GPU workstations and deep learning clusters.\n` +
        `• **Access & Booking:** Open 08:30 AM - 08:00 PM for approved research and academic projects via the app's Booking tab.`;
    } else if (qLower.includes('curfew') || (qLower.includes('hostel') && (qLower.includes('time') || qLower.includes('timing') || qLower.includes('close')))) {
      answerText = `⏰ **Campus Hostel Curfew Timings:**\n\n` +
        `• **Boys Hostel (\`BOYS-HST\`):** Curfew is **09:30 PM**.\n` +
        `• **Girls Hostel (\`GIRLS-HST\`):** Curfew is **09:00 PM**.\n\n` +
        `Turnstiles log entry biometrically. Late entry requires prior formal warden approval. The Central Cafeteria is open until 09:30 PM for dinners and refreshments.`;
    } else if (qLower.includes('grace period') || (qLower.includes('booking') && (qLower.includes('late') || qLower.includes('cancel') || qLower.includes('rule')))) {
      answerText = `📋 **Booking Check-in & Cancellation Rules:**\n\n` +
        `• **15-Minute Grace Period:** You must scan your digital QR access pass at the room door reader within 15 minutes of your booking start time.\n` +
        `• **Automatic No-Show:** Unclaimed reservations are automatically cancelled after 15 minutes and freed up for others.\n` +
        `• **Cancellation:** Cancellations are free up to 30 minutes before the scheduled slot.\n` +
        `• **Quotas:** Students may maintain up to 2 simultaneous bookings, while faculty may have up to 5.`;
    } else if (qLower.includes('emergency') || qLower.includes('sos') || qLower.includes('ambulance') || qLower.includes('doctor') || qLower.includes('hospital')) {
      answerText = `🚨 **24/7 Campus Emergency Assistance:**\n\n` +
        `• **Security Emergency SOS:** Internal **Ext 6000** or **6111** (Direct: +91 (04295) 226000)\n` +
        `• **Medical Center (\`MED-CTR\`):** Internal **Ext 6222** (West Campus near Gate C)\n` +
        `• **24/7 ICU Ambulance Dispatch:** Internal **Ext 6223**\n` +
        `• **Anti-Ragging Helpline:** Internal **Ext 6555**\n\n` +
        `The app includes an Emergency SOS button that broadcasts your live coordinates directly to campus security.`;
    } else if (qLower.includes('dijkstra') || (qLower.includes('routing') && qLower.includes('work')) || qLower.includes('turn-by-turn')) {
      answerText = `🗺️ **Campus Dijkstra Navigation System:**\n\n` +
        `• **320 Calibrated Road Junctions:** The routing engine computes shortest paths across verified campus pathways and pedestrian avenues.\n` +
        `• **Wall & Lawn Avoidance:** Routes strictly adhere to paved roads and designated sidewalks—no cutting through walls.\n` +
        `• **Dual Modes:**\n` +
        `  - **Walk Mode (4.5 km/h):** Uses walkways and accommodates wheelchair ramp routes.\n` +
        `  - **Drive Mode (20 km/h):** Strictly routes vehicles onto vehicular asphalt ring roads with parking bay guidance.`;
    } else if (qLower.includes('macbook') || qLower.includes('vr') || qLower.includes('quest') || qLower.includes('drone') || qLower.includes('3d print') || qLower.includes('asset')) {
      answerText = `💻 **Reserveable High-Value Tech Assets:**\n\n` +
        `• **Apple MacBook Pro M3 Max:** Computer Center B-204 (for ML and mobile development).\n` +
        `• **Meta Quest 3 VR Headsets:** Innovation Lab A-102 (spatial computing & simulations).\n` +
        `• **DJI Mavic 3 Pro Drone:** GIS Spatial Analytics Center (requires 24h advance request & certification).\n` +
        `• **Ender 3 Pro 3D Printers:** Maker Studio B-105 (Mechanical Block, 2h to 12h slots).\n\n` +
        `Reserve via the **Assets** tab to generate a cryptographically signed QR checkout voucher.`;
    } else {
      const cleanPrimaryText = primary.text
        .replace(/^#+\s+/gm, '')
        .replace(/\*\*/g, '')
        .split('\n')
        .filter(l => l.trim().length > 0)
        .slice(0, 4)
        .join(' ');

      answerText = `Based on **${primary.title}** (${primary.category}):\n\n` +
        `${cleanPrimaryText}\n\n` +
        (secondary ? `*Additional context from ${secondary.title}:* ${secondary.snippet}` : '');
    }

    const loc = this.detectLocation(query, retrievedChunks);
    if (loc && !answerText.includes('Would you like to explore how to reach there')) {
      answerText += `\n\n📍 **I have preset ${loc.name} as your navigation destination. Would you like to explore how to reach there?**`;
    }

    const actions = this.detectSuggestedActions(query, retrievedChunks);
    const followUps = this.detectFollowUps(query, retrievedChunks);

    return {
      answer: answerText,
      targetLocation: loc,
      sources: retrievedChunks.map(c => ({
        id: c.id,
        title: c.title,
        category: c.category,
        sourceFile: c.sourceFile,
        buildingCode: c.buildingCode,
        coordinates: c.coordinates,
        snippet: c.snippet
      })),
      suggestedActions: actions,
      suggestedFollowUps: followUps
    };
  }

  async query(message, history = []) {
    if (!this.isInitialized) {
      this.init();
    }

    const retrieved = this.retrieve(message, 4);

    if (process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY) {
      try {
        const llmAnswer = await this.callLLM(message, retrieved, history);
        if (llmAnswer) {
          const loc = this.detectLocation(message, retrieved);
          let finalAnswer = llmAnswer;
          if (loc && !finalAnswer.includes('explore how to reach there')) {
            finalAnswer += `\n\n📍 **I have preset ${loc.name} as your navigation destination. Would you like to explore how to reach there?**`;
          }

          const actions = this.detectSuggestedActions(message, retrieved);
          const followUps = this.detectFollowUps(message, retrieved);
          return {
            answer: finalAnswer,
            targetLocation: loc,
            sources: retrieved.map(c => ({
              id: c.id,
              title: c.title,
              category: c.category,
              sourceFile: c.sourceFile,
              buildingCode: c.buildingCode,
              coordinates: c.coordinates,
              snippet: c.snippet
            })),
            suggestedActions: actions,
            suggestedFollowUps: followUps
          };
        }
      } catch (err) {
        console.warn('[RAG Service] LLM call failed, falling back to local synthesizer:', err.message);
      }
    }

    return this.synthesizeAnswer(message, retrieved);
  }

  async callLLM(userPrompt, contextChunks, history = []) {
    const contextText = contextChunks
      .map((c, i) => `[Document ${i + 1}: ${c.title} (${c.sourceFile})]\n${c.text}`)
      .join('\n\n---\n\n');

    const systemInstruction = `You are the BIT Smart Campus AI Navigator & Assistant. Use only the provided campus context to answer questions accurately, concisely, and helpfully. Include relevant room numbers, floor levels, building codes, or contact numbers when available.
IMPORTANT NAVIGATION RULE: Whenever the user asks about or refers to a specific campus location, building, room, lab, or facility: provide comprehensive details about that place, and always conclude your answer by stating: "📍 I have preset this location as your navigation destination. Would you like to explore how to reach there?"
If the context does not have the answer, politely direct the user to the Campus Help Desk or Emergency SOS at Ext 6000.\n\nContext:\n${contextText}`;

    // 1. Google Gemini API (defaults to latest gemini-2.5-flash, with gemini-2.0-flash fallback)
    if (process.env.GEMINI_API_KEY) {
      const apiKey = process.env.GEMINI_API_KEY.trim();
      const preferredModel = process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : null;
      const candidateModels = preferredModel
        ? [preferredModel, 'gemini-2.5-flash', 'gemini-2.0-flash']
        : ['gemini-2.5-flash', 'gemini-2.0-flash'];

      const contents = [];
      if (Array.isArray(history)) {
        history.slice(-4).forEach(h => {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: userPrompt }]
      });

      const bodyPayload = JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800
        }
      });

      for (const model of candidateModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: bodyPayload
          });

          if (res.ok) {
            const data = await res.json();
            const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidate) return candidate.trim();
          } else {
            const errorText = await res.text();
            if (res.status === 403) {
              console.warn(`[RAG Service] Gemini API Key is disabled by Google (reported as leaked). Using deterministic campus RAG synthesis fallback.\n👉 To use Gemini, generate a new free key at: https://aistudio.google.com/app/apikey and replace GEMINI_API_KEY in server/.env`);
              break;
            }
            console.warn(`[RAG Service] Gemini API (${model}) returned status ${res.status}:`, errorText);
            // If model is not recognized in API endpoint, gracefully try next modern candidate
            if (res.status === 404) continue;
            break;
          }
        } catch (e) {
          console.warn(`[RAG Service] Network error calling Gemini (${model}):`, e.message);
        }
      }
    }

    // 2. OpenAI API
    if (process.env.OPENAI_API_KEY) {
      const apiKey = process.env.OPENAI_API_KEY.trim();
      const messages = [
        { role: 'system', content: systemInstruction },
        ...(Array.isArray(history) ? history.slice(-4).map(h => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.text
        })) : []),
        { role: 'user', content: userPrompt }
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.2,
          max_tokens: 800
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content.trim();
      } else {
        const errorText = await res.text();
        console.warn('[RAG Service] OpenAI API returned error:', errorText);
      }
    }

    return null;
  }

  getSuggestedPrompts() {
    return [
      { id: '1', label: 'Where is the AI Lab located?', category: 'Navigation', icon: 'map-pin' },
      { id: '2', label: 'What are the hostel curfew hours?', category: 'Campus Rules', icon: 'clock' },
      { id: '3', label: 'What is the booking 15-min grace period?', category: 'Bookings', icon: 'calendar' },
      { id: '4', label: 'What is the campus emergency number?', category: 'Emergency', icon: 'shield' },
      { id: '5', label: 'How does Dijkstra road navigation work?', category: 'GIS Routing', icon: 'compass' },
      { id: '6', label: 'How can I reserve a MacBook Pro or VR headset?', category: 'Assets', icon: 'package' }
    ];
  }

  getStats() {
    const categories = new Set(this.chunks.map(c => c.category));
    const files = new Set(this.chunks.map(c => c.sourceFile));
    return {
      status: 'ready',
      totalChunks: this.chunks.length,
      categoriesCount: categories.size,
      sourceFilesCount: files.size,
      sourceFiles: Array.from(files),
      knowledgeBaseDirectory: this.knowledgeBaseDir
    };
  }
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re',
  'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who',
  'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve'
]);

module.exports = new RagService();
