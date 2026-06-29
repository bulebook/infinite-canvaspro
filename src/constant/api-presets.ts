import type { ModelChannel } from '@/stores/use-config-store';

export interface ApiPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  channel: Omit<ModelChannel, 'id'>;
  docsUrl?: string;
}

export const API_PRESETS: ApiPreset[] = [
  {
    id: 'volcano',
    name: '火山引擎（火山方舟）',
    description: '豆包/Seedream/Seedance 系列，国内直连低延迟',
    icon: '🔥',
    channel: {
      name: '火山方舟',
      baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
      apiKey: '',
      models: [
        'doubao-seedream-4.5',
        'doubao-seedream-4.0',
        'doubao-seedance-1.5-pro',
        'doubao-seedance-1.5-lite-t2v',
        'doubao-seedance-1.5-lite-i2v',
        'doubao-seedance-1.0-pro',
        'doubao-seedance-1.0-lite-t2v',
        'doubao-seedance-1.0-lite-i2v',
        'doubao-1.5-pro-256k',
        'doubao-1.5-lite-32k',
        'doubao-1.5-thinking-pro',
        'doubao-seed-tts-2.0',
      ],
    },
    docsUrl: 'https://console.volcengine.com/ark/',
  },
];