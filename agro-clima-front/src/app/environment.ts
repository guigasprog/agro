declare global {
  interface Window {
    __env?: {
      apiUrl?: string;
    };
  }
}

function resolveApiUrl(): string {
  // 1. Se foi injetado via runtime (ex: env.js gerado pelo Coolify/Docker)
  if (typeof window !== 'undefined' && window.__env?.apiUrl && window.__env.apiUrl.trim() !== '') {
    return window.__env.apiUrl.replace(/\/+$/, '');
  }

  // 2. Se estiver rodando localmente via 'ng serve' na porta 4200
  if (typeof window !== 'undefined' && window.location.port === '4200') {
    return 'http://localhost:8080';
  }

  // 3. Produção / Docker / Coolify: usa URL relativa com reverse proxy do Nginx
  // Assim a URL acompanha qualquer porta ou domínio da aplicação automaticamente
  return '/api';
}

export const environment = {
  get apiUrl(): string {
    return resolveApiUrl();
  }
};
