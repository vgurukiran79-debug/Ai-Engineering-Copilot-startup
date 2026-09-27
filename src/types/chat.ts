export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'code' | 'image' | 'doc' | 'archive';
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeBlocks?: CodeBlock[];
  thinkingProcess?: string;
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  category?: 'debug' | 'project' | 'study' | 'web' | 'general';
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  isPinned?: boolean;
  projectMeta?: {
    projectName: string;
    projectGoal: string;
    techStack?: string[];
  };
}

export interface ActionCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  promptTemplate: string;
  accentColor: string;
}

export interface QuickSuggestion {
  id: string;
  label: string;
  prompt: string;
  iconType: string;
}
