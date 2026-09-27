import { ActionCard, ChatSession, QuickSuggestion, Message } from '../types/chat';

export const INITIAL_ACTION_CARDS: ActionCard[] = [
  {
    id: 'code-debug',
    title: 'Code & Debug',
    description: 'Diagnose runtime errors, refactor algorithms, and inspect stack traces.',
    iconName: 'Bug',
    promptTemplate: 'Please review and debug this code snippet. Point out performance bottlenecks and security vulnerabilities: ',
    accentColor: '#00D2FF',
  },
  {
    id: 'file-analysis',
    title: 'File Analysis',
    description: 'Deep-dive into architecture diagrams, Dockerfiles, and package configs.',
    iconName: 'FileSearch',
    promptTemplate: 'Analyze our repository architecture and suggest structural improvements for scalability: ',
    accentColor: '#38BDF8',
  },
  {
    id: 'build-projects',
    title: 'Build Projects',
    description: 'Scaffold full-stack web applications, microservices, and client apps.',
    iconName: 'Rocket',
    promptTemplate: 'Generate an end-to-end fullstack project structure using React, Node.js, and PostgreSQL for: ',
    accentColor: '#2563EB',
  },
  {
    id: 'learning-study',
    title: 'Learning & Study',
    description: 'Master system design, distributed consensus, data structures, and algorithms.',
    iconName: 'BookOpen',
    promptTemplate: 'Explain the core mechanics of Raft consensus vs Paxos in simple engineering terms with examples: ',
    accentColor: '#818CF8',
  },
  {
    id: 'web-api-help',
    title: 'Web & API Help',
    description: 'Design RESTful, GraphQL, and gRPC contracts with OpenAPI specifications.',
    iconName: 'Globe',
    promptTemplate: 'Design an idempotent REST API schema for an online payment processing service: ',
    accentColor: '#06B6D4',
  },
  {
    id: 'general-help',
    title: 'General Help',
    description: 'CI/CD pipeline scripts, Git branch workflows, and engineering career advice.',
    iconName: 'Sparkles',
    promptTemplate: 'What are the top 5 engineering production readiness checklist items for a high-traffic launch? ',
    accentColor: '#A855F7',
  },
];

export const QUICK_SUGGESTIONS: QuickSuggestion[] = [
  {
    id: 'sugg-1',
    label: '</> Explain this code',
    prompt: 'Explain how this asynchronous pipeline executes and what the potential race conditions are.',
    iconType: 'Code2',
  },
  {
    id: 'sugg-2',
    label: '🚀 Help me with a project idea',
    prompt: 'Give me 3 innovative, resume-grade engineering project ideas utilizing distributed systems and AI agents.',
    iconType: 'Rocket',
  },
  {
    id: 'sugg-3',
    label: '⚡ Optimize React performance',
    prompt: 'How do I identify and eliminate unnecessary re-renders in a high-frequency trading dashboard in React?',
    iconType: 'Zap',
  },
  {
    id: 'sugg-4',
    label: '🛡️ Security audit best practices',
    prompt: 'Provide a comprehensive security checklist for OAuth 2.0 PKCE and JWT token storage in SPAs.',
    iconType: 'ShieldCheck',
  },
  {
    id: 'sugg-5',
    label: '📐 System Design: URL Shortener',
    prompt: 'Step-by-step system design for a high-throughput URL shortener handling 10,000 writes/sec and 100,000 reads/sec.',
    iconType: 'LayoutGrid',
  },
];

export const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session-copilot-features',
    title: 'AI Engineering Copilot Features',
    category: 'general',
    createdAt: 'Today, 2:15 PM',
    updatedAt: 'Today, 2:18 PM',
    isPinned: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'What core engineering capabilities do you provide as my AI Copilot?',
        timestamp: '2:15 PM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `I'm your **AI Engineering Copilot**, engineered specifically for developers, systems architects, and students. Here are the 4 primary operational domains I specialize in:

1. **Full-Stack Architecture & Code Generation**: End-to-end scaffolding across TypeScript, Python, Go, Rust, and modern cloud stacks.
2. **Autonomous Debugging & Profiling**: Memory leak detection, race condition elimination, and SQL query indexing analysis.
3. **Interactive System Design**: Microservice topologies, caching layers (Redis/Memcached), and distributed queues (Kafka/RabbitMQ).
4. **Production Readiness Audits**: Dockerfile optimization, Kubernetes manifests, and zero-trust API security.

Check out this quick example of an idempotent API retry wrapper:`,
        timestamp: '2:16 PM',
        codeBlocks: [
          {
            language: 'typescript',
            filename: 'retryWithBackoff.ts',
            code: `export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 400
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    // Exponential jitter backoff
    const jitter = Math.random() * 100;
    await new Promise((res) => setTimeout(res, delayMs + jitter));
    return retryWithBackoff(fn, retries - 1, delayMs * 2);
  }
}`,
          },
        ],
        thinkingProcess: 'Synthesized capabilities matrix focusing on practical engineering utility, low-latency execution, and concrete production patterns.',
      },
    ],
  },
  {
    id: 'session-python-code',
    title: 'Python code explanation',
    category: 'study',
    createdAt: 'Yesterday',
    updatedAt: 'Yesterday, 6:40 PM',
    messages: [
      {
        id: 'msg-p1',
        role: 'user',
        content: 'Can you explain how Python asyncio event loops handle non-blocking sockets internally with epoll/kqueue?',
        timestamp: '6:38 PM',
      },
      {
        id: 'msg-p2',
        role: 'assistant',
        content: `Under the hood, Python's \`asyncio\` event loop leverages OS-level multiplexing primitives—specifically **epoll** on Linux and **kqueue** on macOS/BSD.

### The Mechanics:
1. **File Descriptor Registration**: When a coroutine awaits on a socket read/write, Python registers the file descriptor with the selector.
2. **Zero-Busy-Wait Sleep**: The loop invokes \`select()\` / \`epoll_wait()\` with a calculated timeout, yielding CPU execution until kernel interrupt fires.
3. **Callback Resolution**: When the socket becomes readable, the OS notifies the selector, which marks the paused \`Future\` as done and resumes the generator task.`,
        timestamp: '6:40 PM',
        codeBlocks: [
          {
            language: 'python',
            filename: 'async_socket_demo.py',
            code: `import asyncio

async def fetch_telemetry(host: str, port: int):
    # Non-blocking connection handled via underlying epoll selector
    reader, writer = await asyncio.open_connection(host, port)
    writer.write(b"GET_STATUS\\n")
    await writer.drain()
    
    data = await reader.readline()
    print(f"Received metrics: {data.decode().strip()}")
    writer.close()
    await writer.wait_closed()`,
          },
        ],
      },
    ],
  },
  {
    id: 'session-college-project',
    title: 'Project idea for college',
    category: 'project',
    createdAt: '2 days ago',
    updatedAt: '2 days ago',
    messages: [
      {
        id: 'msg-c1',
        role: 'user',
        content: 'I need an impressive college capstone project idea in AI & Computer Systems.',
        timestamp: '11:10 AM',
      },
      {
        id: 'msg-c2',
        role: 'assistant',
        content: `Here is a standout project idea designed to impress academic evaluators and hiring managers alike:

### Project Title: "AeroShield: Edge-Accelerated Drone Detection via WebAssembly & TensorRT"
- **Tech Stack**: Rust / WebAssembly, ONNX Runtime, Python (FastAPI), React, WebRTC.
- **The Problem**: Real-time object tracking on bandwidth-constrained edge nodes requires minimal latency without heavy cloud roundtrips.
- **Novelty Factor**: Deploying quantized vision models compiled directly into browser-side WASM SIMD, coupled with a distributed event mesh.
- **Deliverables**:
  - Benchmarked latency graphs (<18ms inference)
  - Real-time video canvas with bounding boxes
  - Exportable forensic anomaly reports in JSON`,
        timestamp: '11:12 AM',
      },
    ],
  },
  {
    id: 'session-microservices',
    title: 'Microservices event-driven design',
    category: 'debug',
    createdAt: '3 days ago',
    updatedAt: '3 days ago',
    messages: [
      {
        id: 'msg-m1',
        role: 'user',
        content: 'How should I structure the Outbox pattern with Debezium and Apache Kafka?',
        timestamp: '4:20 PM',
      },
      {
        id: 'msg-m2',
        role: 'assistant',
        content: `The **Transactional Outbox Pattern** guarantees dual-write consistency between your local transactional database (PostgreSQL/MySQL) and Kafka message brokers without distributed 2PC locks.

1. **Single ACID Transaction**: Write your domain state and insert an event record into an \`outbox_events\` table within the same DB transaction.
2. **Change Data Capture (CDC)**: Debezium reads the PostgreSQL WAL (write-ahead log) asynchronously and pushes events onto the corresponding Kafka topic with at-least-once semantics.`,
        timestamp: '4:22 PM',
      },
    ],
  },
];

export async function simulateAIResponse(userPrompt: string, history?: Message[]): Promise<Message> {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. If the user configured an OpenRouter API key in localStorage, query OpenRouter directly
  try {
    const openRouterKey = localStorage.getItem('openrouter_api_key')?.trim();
    const openRouterModel = localStorage.getItem('openrouter_selected_model') || 'google/gemini-2.5-flash';

    if (openRouterKey) {
      const messagesPayload = [
        {
          role: 'system',
          content:
            'You are an intelligent, helpful AI Copilot. When asked a simple or factual question, give a direct, clean, and accurate answer immediately without unnecessary preamble. When asked coding, technical, or architecture questions, provide concise, high-quality, production-ready code and explanations.',
        },
      ];

      if (history && history.length > 0) {
        for (const msg of history) {
          if (msg.content) {
            messagesPayload.push({
              role: msg.role === 'assistant' ? 'assistant' : 'user',
              content: msg.content,
            });
          }
        }
      }

      messagesPayload.push({
        role: 'user',
        content: userPrompt.trim(),
      });

      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Engineering Copilot',
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: messagesPayload,
        }),
      });

      if (openRouterRes.ok) {
        const orData = await openRouterRes.json();
        const reply = orData?.choices?.[0]?.message?.content;
        if (reply) {
          return {
            id: 'ai-' + Date.now(),
            role: 'assistant',
            content: reply,
            timestamp: timeStr,
          };
        }
      } else {
        const errorJson = await openRouterRes.json().catch(() => null);
        console.warn('OpenRouter API error:', errorJson);
      }
    }
  } catch (openRouterErr) {
    console.warn('OpenRouter request error:', openRouterErr);
  }

  // 2. Default: Call the real protected backend Express route /api/chat (using Gemini)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userPrompt,
        history: history ? history.map((m) => ({ role: m.role, content: m.content })) : undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: data.reply,
          timestamp: timeStr,
        };
      }
    } else {
      const errData = await res.json().catch(() => null);
      if (errData?.error && errData.error.includes('GEMINI_API_KEY')) {
        return {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: `⚠️ **Backend Notice**: ${errData.error}\n\nPlease add your API key securely in the **Settings > Secrets** panel or in your server environment variables (\`GEMINI_API_KEY\`). Once added, real Gemini responses will be generated automatically.`,
          timestamp: timeStr,
        };
      }
      console.warn('Backend /api/chat error, falling back to local assistant response:', errData?.error);
    }
  } catch (netErr) {
    console.warn('Network error reaching /api/chat, falling back:', netErr);
  }

  // Fallback response if server route is offline or key not yet set
  await new Promise((resolve) => setTimeout(resolve, 350));
  const lower = userPrompt.toLowerCase();

  if (lower.includes('code') || lower.includes('debug') || lower.includes('function') || lower.includes('refactor')) {
    return {
      id: 'ai-' + Date.now(),
      role: 'assistant',
      content: `I've analyzed your request and engineered an optimized, production-hardened solution.

### Architectural Breakdown:
- **Type Safety**: Enforced strict generic constraints.
- **Fail-Fast Mechanics**: Added early validation and edge-case handling.
- **Complexity**: Reduced time complexity to **O(n)** with amortized constant memory.`,
      timestamp: timeStr,
      codeBlocks: [
        {
          language: 'typescript',
          filename: 'solution.ts',
          code: `// AI Engineering Copilot Solution
interface CacheConfig<K, V> {
  maxSize: number;
  ttlMs: number;
}

export class ConcurrentLRUCache<K, V> {
  private cache = new Map<K, { val: V; expiresAt: number }>();
  
  constructor(private config: CacheConfig<K, V>) {}

  public get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    // Refresh access order
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.val;
  }
}`,
        },
      ],
      thinkingProcess: 'Evaluated algorithmic constraints and edge cases; applied defensive programming and clean object lifecycle management.',
    };
  }

  if (lower.includes('project') || lower.includes('idea') || lower.includes('build') || lower.includes('college')) {
    return {
      id: 'ai-' + Date.now(),
      role: 'assistant',
      content: `Here is a high-impact, modern engineering project architecture tailored to your prompt:

### System Architecture Blueprint:
1. **Ingestion Layer**: High-throughput message ingestion with rate-limiting bucket token algorithms.
2. **Compute Core**: Microservice workers listening to asynchronous Redis stream queues.
3. **Observability**: Prometheus metrics exporter + OpenTelemetry distributed tracing spans.

### Next Implementation Milestones:
- [ ] Define OpenAPI schema contracts
- [ ] Setup Docker Compose development cluster with health checks
- [ ] Implement synthetic load tests using k6`,
      timestamp: timeStr,
      codeBlocks: [
        {
          language: 'yaml',
          filename: 'docker-compose.yml',
          code: `version: '3.8'
services:
  api-gateway:
    build: ./services/gateway
    ports:
      - "8080:8080"
    environment:
      - REDIS_URL=redis://cache:6379
    depends_on:
      - cache

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:`,
        },
      ],
      thinkingProcess: 'Synthesized full-stack production specifications with microservice patterns, container definitions, and roadmap milestones.',
    };
  }

  // Default intelligent assistant response
  return {
    id: 'ai-' + Date.now(),
    role: 'assistant',
    content: `Understood! I've processed your prompt: **"${userPrompt}"**

Here is the engineering assessment and practical recommendations:

1. **Validation & Requirements**: Confirm your target latency, throughput thresholds, and fault tolerance SLAs.
2. **Implementation Strategy**: Prioritize modular separation of concerns so components can be tested and horizontally scaled independently.
3. **Production Considerations**: Ensure logging is structured (JSON), sensitive keys are rotated, and rate limits are placed on all public ingress points.

Would you like me to generate a complete boilerplate codebase, run an automated unit test suite, or draft an architecture diagram for this?`,
    timestamp: timeStr,
    thinkingProcess: 'Parsed user intent, structured response into actionable engineering steps, and formulated follow-up execution options.',
  };
}
