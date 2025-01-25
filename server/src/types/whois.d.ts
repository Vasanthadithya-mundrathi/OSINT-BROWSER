declare module 'whois' {
  export function lookup(domain: string, options: any, callback: (err: Error | null, data: any) => void): void;
  export function lookup(domain: string, callback: (err: Error | null, data: any) => void): void;
}
